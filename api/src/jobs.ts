import { Job, Queue, QueueEvents, QueueScheduler, Worker } from 'bullmq';
import * as Debug from 'debug';
import * as glob from 'glob';
import Redis, { RedisOptions } from 'ioredis';
import * as path from 'path';
import 'reflect-metadata';
import { Container, Inject, Service } from 'typedi';
import { Connection, useContainer as TypeORMUseContainer } from 'typeorm';
import { loadFromGlobArray } from 'warthog';
import { Binding } from '../generated/binding';
import {
  BatchJob,
  bindRemote,
  ConfigService,
  getContainer,
  getRedisConnection,
  getRedisConnectionOptions,
  Logger,
  QueueEventEntry,
  QueuePayload,
} from './core';
import { getDBConnection } from './db/connection';
import { NotificationService } from './modules/core/notifications/notification.service';
import { UserService } from './modules/identity/user/user.service';

const debug = Debug.debug('warthog:jobs');

// process.on('uncaughtException', (err: Error) => {
//   // console.log('uncaughtException', err);
//   process.exit(1);
// });

TypeORMUseContainer(Container);

@Service('JobServer')
export class JobServer {
  dbConnection?: Connection;
  queueEvents?: QueueEvents;
  redisOptions: RedisOptions;
  connection: Redis.Redis;
  binding!: Binding;

  constructor(
    @Inject('ConfigService') public readonly configService: ConfigService,
    @Inject('Logger') public readonly logger: Logger
  ) {
    this.connection = getRedisConnection();
    this.redisOptions = getRedisConnectionOptions();
  }

  async start() {
    await this.establishDBConnection();
    this.loadServices();
    await this.loadJobs();
  }

  async establishDBConnection(): Promise<Connection> {
    try {
      return (this.dbConnection = await getDBConnection());
    } catch (error) {
      this.logger.error('Failed to establish DB connection', error);
      throw new Error(error);
    }
  }

  // Load all Warthog "Services" so that they're available in our workers
  loadServices() {
    // console.log(
    //   'loadServices: ',
    //   this.configService.get('ROOT_FOLDER'),
    //   this.configService.get('SERVICES_PATH')
    // );
    loadFromGlobArray([
      path.join(this.configService.get('ROOT_FOLDER'), this.configService.get('SERVICES_PATH')),
    ]);
  }

  async loadJobs() {
    const notificationService = getContainer(NotificationService);
    const userService = getContainer(UserService);
    const token = await userService.getUserToken({ id: userService.SYSTEM_USER_ID }, '5y'); // expires in 5 years - i.e. don't expire
    const folderGlob = `${this.configService.get('ROOT_FOLDER')}/${this.configService.get(
      'JOBS_PATH'
    )}`;
    const files = glob.sync(folderGlob);

    this.binding = await bindRemote(undefined, token);
    const _binding = this.binding;
    debug('_binding :>> ', _binding);
    if (!_binding) {
      throw new Error('Unable to create binding');
    }
    const _config = this.configService;

    debug('loadQueues v2: files', files);
    if (!files.length) {
      this.logger.error(`No job files found. ${folderGlob}`);
      // console.log(this.configService.getAll());
      throw new Error(`No job files found. ${folderGlob}`);
    }

    const queueRegistry: {
      [key: string]: Queue;
    } = {};

    function getQueue(name: string) {
      return queueRegistry[name];
    }

    for (let index = 0; index < files.length; index++) {
      const fileName = files[index];

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const queueConfig: BatchJob = require(fileName).default;
      const queueName = queueConfig.name;
      // TODO: add Queue<GenericType>
      const queue = new Queue(queueName, { connection: this.redisOptions });

      // Add queue to registry
      queueRegistry[queueName] = queue;

      // Always default to logging failed events.  If you don't want to log failed events
      // you can always pass in { events: [] }
      if (typeof queueConfig.events === 'undefined') {
        queueConfig.events = ['failed'];
      }

      // Wire up QueueEvents if they're specified
      if (queueConfig.events && queueConfig.events.length) {
        const queueEvents = new QueueEvents(queueName, { connection: this.redisOptions });

        queueConfig.events.forEach((fnOrString: QueueEventEntry) => {
          // This needs to put the right queue events on based on what's in the array
          if (typeof fnOrString === 'string') {
            if (fnOrString === 'failed') {
              queueEvents.on('failed', ({ jobId, failedReason }) => {
                // console.log(`${jobId} has failed with reason ${failedReason}`);
              });
            } else {
              // Not implemented
            }
            return;
          }

          fnOrString(queueEvents);
        });
      }

      // Adds a scheduler to drain the queue
      if (queueConfig.scheduler) {
        try {
          new QueueScheduler(queueName, { connection: this.redisOptions }) as QueueScheduler;
        } catch (e) {
          console.error(`Error creating Queue Scheduler: ${e}`);
          throw e;
        }
      }

      // Adds a single scheduled job
      if (queueConfig.schedule) {
        const dataOption = queueConfig.data ? { data: queueConfig.data } : {};

        await queue.add(
          queueName,
          {
            ...dataOption,
            meta: {
              userId: 'user_12345', // what should we set these as for a job on a timer?
              traceId: 'trace_abc123',
            },
          },
          queueConfig.schedule
        );
      }

      if (queueConfig.process) {
        const jobFn = async (job: Job<QueuePayload<any>>): Promise<void> => {
          // if (!queueConfig.schedule) {
          //   console.time(queueName);
          // }

          if (!queueConfig.schedule) {
            this.logger.info(`Running job ${queueConfig.name}`, job.data);
          }

          if (!job.data && !(job.data as any).data) {
            throw new Error(
              'Data was not passed into the job.  Did you wrap payload in data attribute?'
            );
          }

          try {
            await queueConfig.process({
              binding: _binding,
              config: _config,
              redisOptions: this.redisOptions,
              dbConnection: this.dbConnection!,
              container: Container,
              debug: Debug.debug(`job:${queueName}`),
              notifier: notificationService,
              logger: this.logger,
              userId: job.data?.meta?.userId,
              systemUserId: '1234', // TODO: pull the correct system user id
              data: job.data.data,
              getQueue,
              job,
            });
          } catch (error) {
            console.error(error);
          }

          // // This was too noisy in logs
          // if (!queueConfig.schedule) {
          //   console.timeEnd(queueName);
          // }
        };

        new Worker(queueConfig.name, jobFn, { connection: this.redisOptions });
      }
    }
  }
}

if (require.main === module) {
  getContainer(JobServer)
    .start()
    .then(() => {
      // console.log('Job server started');
    })
    .catch(console.error);
}
