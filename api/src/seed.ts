import { existsSync, readdirSync } from 'fs';
import * as path from 'path';
import 'reflect-metadata';
import { Container, Inject, Service } from 'typedi';
import { createConnection as typeORMCreateConnection, useContainer } from 'typeorm';
import { Config, Database } from 'warthog';
import { ConfigService, getContainer, Logger } from '../src/core';

useContainer(Container);

@Service('AppSeeder')
class AppSeeder {
  database: Database;
  constructor(
    @Inject('ConfigService') public readonly configService: ConfigService,
    @Inject('Logger') public readonly logger: Logger
  ) {
    this.database = new Database(new Config());
    return this;
  }

  async seed() {
    // console.log(this.configService.getAll());
    // Establish DB connection
    try {
      const baseConfig = this.database.getBaseConfig();
      // console.log('baseConfig :>> ', baseConfig);
      // TODO: use this.database.createConnection
      const connection = await typeORMCreateConnection(baseConfig);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }

    try {
      const modulesDir = path.join(__dirname, 'modules');
      const moduleFolders = readdirSync(modulesDir, { withFileTypes: true }).filter((dirent) =>
        dirent.isDirectory()
      );

      for (let index = 0; index < moduleFolders.length; index++) {
        const directory = moduleFolders[index];

        const seedFile = this.configService.get('SERVICES_PATH').endsWith('.js')
          ? 'seed.js'
          : 'seed.ts';
        const moduleSeedFile = path.join(modulesDir, directory.name, seedFile);
        if (existsSync(moduleSeedFile)) {
          const klass: any = require(moduleSeedFile).default;
          const instance = getContainer(klass);

          await instance.seed();
        }
        return 'exiting early for now';
      }
    } catch (error) {
      this.logger.error(error);
    }
    return 'exiting early for now';
  }
}

if (require.main === module) {
  Container.get<AppSeeder>('AppSeeder').seed();
}
