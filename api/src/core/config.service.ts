import * as BaseJoi from '@hapi/joi';
import * as Debug from 'debug';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Inject, Service } from 'typedi';
import { WarthogConfigService } from './warthog-config.service';

const debug = Debug.debug('warthog:config');

export interface EnvConfig {
  [key: string]: string;
}

const Joi = BaseJoi.extend((joi) => ({
  type: 'stringArray',
  base: joi.array(),
  coerce: (value, helpers) => {
    debug('coerce :>> ', value);
    return value.split ? value.split(',') : value;
  },
}));
@Service('ConfigService')
export class ConfigService {
  readonly WARTHOG_ENV_PREFIX = 'WARTHOG_';

  projectRoot: string;
  nodeEnv?: string;
  envConfig!: EnvConfig;
  dotenvPath: string;

  constructor(@Inject('WarthogConfigService') public readonly warthogConfig: WarthogConfigService) {
    this.projectRoot = process.env.WARTHOG_DOTENV_PATH || process.cwd();
    this.dotenvPath = /* options.dotenvPath || */ this.projectRoot;
    this.nodeEnv = this.determineNodeEnv();
    this.load();
    debug(this.getAll());
    return this;
  }

  load() {
    this.loadDotenvFiles();
    this.validateInput(this.envConfig);
    return this;
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  // If something has  suffix, validate as number
  validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: BaseJoi.ObjectSchema = Joi.object({
      DEBUG: Joi.string(),
      NODE_ENV: Joi.string().default('development'),
      WARTHOG_AUTO_OPEN_PLAYGROUND: Joi.boolean().default(false),
      WARTHOG_AUTO_GENERATE_FILES: Joi.boolean().default(false),
      WARTHOG_MAILGUN_KEY: Joi.string(),
      WARTHOG_SMTP_DEFAULT_FROM: Joi.string(),
      WARTHOG_SMTP_HOSTNAME: Joi.string(),
      WARTHOG_SMTP_PORT: Joi.number().default(587),
      WARTHOG_SMTP_USERNAME: Joi.string(),
      WARTHOG_SMTP_PASSWORD: Joi.string(),
      WARTHOG_ADMIN_PASSWORD: Joi.string(),
      WARTHOG_API_PORT: Joi.number(),
      WARTHOG_API_BASE_URL: Joi.string(),
      WARTHOG_DB_URL: Joi.string(),
      WARTHOG_DB_DATABASE: Joi.string(),
      WARTHOG_DB_ENTITIES: Joi.string(),
      WARTHOG_DB_HOST: Joi.string(),
      WARTHOG_DB_LOGGING: Joi.string(), // ENUM
      WARTHOG_DB_MIGRATIONS: Joi.string(),
      WARTHOG_DB_PASSWORD: Joi.string().allow('').optional(),
      WARTHOG_DB_PORT: Joi.number().default(5432),
      WARTHOG_DB_SUBSCRIBERS: Joi.string(),
      WARTHOG_DB_SYNCHRONIZE: Joi.boolean().default(false),
      WARTHOG_DB_USERNAME: Joi.string(),
      WARTHOG_DB_SEEDS: Joi.string(),
      WARTHOG_DB_SEEDS_DIR: Joi.string(),
      WARTHOG_FILTER_BY_DEFAULT: Joi.boolean().default(false),
      WARTHOG_JOBS_PATH: Joi.string(),
      WARTHOG_JWT_SECRET: Joi.string(),
      WARTHOG_JWT_EXPIRATION: Joi.string(),
      WARTHOG_ORMCONFIG_PATH: Joi.string(),
      SKIP_USER_REGISTRATION_CHECKS: Joi.string(),

      // WARTHOG_SERVICES_PATH: Joi.stringArray().items(Joi.string()),
      // WARTHOG_MODELS_PATH: Joi.stringArray().items(Joi.string()),
      // WARTHOG_RESOLVERS_PATH: Joi.stringArray().items(Joi.string()),
      WARTHOG_SERVICES_PATH: Joi.string(),
      WARTHOG_MODELS_PATH: Joi.string(),
      WARTHOG_RESOLVERS_PATH: Joi.string(),

      NEXT_PUBLIC_APP_BASE_URL: Joi.string(),

      REDIS_HOST: Joi.string(),
      REDIS_PORT: Joi.number(),
      REDIS_PASSWORD: Joi.string(),
      REDIS_URL: Joi.string(),

      CUSTOMERIO_TRACKING_SITE_ID: Joi.string(),
      CUSTOMERIO_TRACKING_API_KEY: Joi.string(),
      CUSTOMERIO_API_KEY: Joi.string(),

      TASKFORCE_TOKEN: Joi.string(),

      SCROOBIOUS_ADMIN_DB_PASSWORD: Joi.string(),
      SCROOBIOUS_ADMIN_EMAIL: Joi.string(),

      STRIPE_SECRET_KEY: Joi.string(),
      SYSTEM_USER_ID: Joi.string(),

      WISTIA_ACCESS_TOKEN: Joi.string(),
      WISTIA_FOUNDER_VIDEO_PROJECT_ID: Joi.string(),
      WISTIA_STATS_TOKEN: Joi.string(),

      SLACK_BOT_TOKEN: Joi.string(),

      TZ: Joi.string(),

      S3_REGION: Joi.string(),
      S3_BUCKET_NAME: Joi.string(),
      S3_ACCESS_KEY_ID: Joi.string(),
      S3_SECRET_ACCESS_KEY: Joi.string(),
      S3_BUCKET_SIGNED_URL_EXPIRES: Joi.number(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return (this.envConfig = validatedEnvConfig);
  }

  getAll(): EnvConfig {
    return this.envConfig;
  }

  getApiUrl(path?: string) {
    return new URL(path ?? '', this.get('API_BASE_URL')).href;
  }

  getWebUrl(path?: string) {
    return new URL(path ?? '', this.get('NEXT_PUBLIC_APP_BASE_URL')).href;
  }

  get(key: string): string {
    const envValue = this.envConfig[key];
    const value = envValue || this.warthogConfig.get(key) || process.env[key];
    // console.log('values', key, envValue, value);
    // console.log('get', key, value);

    if (!value) {
      throw new Error(`Expected to find a value for Config key: ${key}`);
    }

    return value;
  }

  // Allow NODE_ENV to be set in the .env file.  Check for this first here and then fall back on
  // the environment variable.  The reason we do this is because using dotenvi will allow us to switch
  // between environments.  If we require an actual environment variable to be set then we'll have to set
  // and unset the value in the current terminal buffer.
  determineNodeEnv() {
    let nodeEnv: any = process.env.NODE_ENV;

    const filepath = path.join(this.dotenvPath, '.env');
    if (fs.existsSync(filepath)) {
      const config = dotenv.parse(fs.readFileSync(filepath));
      if (config.NODE_ENV) {
        nodeEnv = config.NODE_ENV;
      }
    }

    (process.env as any).NODE_ENV = nodeEnv;

    return (this.nodeEnv = nodeEnv);
  }

  loadDotenvFiles() {
    // .local files are for secrets, load those first
    const files = ['.env', '.env.local', `.env.${this.nodeEnv}.local`];
    let config = {};

    let result: { parsed?: object; error?: object } | undefined = {};
    files.forEach((filename: string) => {
      const filepath = path.join(this.dotenvPath, filename);
      if (fs.existsSync(filepath)) {
        debug(`Using dotenv file: ${filepath}`);

        result = dotenv.config({ path: filepath }).parsed;
        if (result) {
          config = { ...config, ...result };
        }
      }
    });

    return (this.envConfig = config);
  }
}
