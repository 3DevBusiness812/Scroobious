import { Job, JobsOptions, Queue, QueueEvents, RateLimiterOptions } from 'bullmq';
import * as Debug from 'debug';
import { RedisOptions } from 'ioredis';
import { Container } from 'typedi';
import { Connection, DeepPartial as TypeORMDeepPartial } from 'typeorm';
import { ConfigService, Logger } from '.';
import { Binding } from '../../generated/binding';
import { NotificationService } from '../modules/core/notifications/notification.service';

export type DeepPartial<T> = TypeORMDeepPartial<T>;

// Omit Warthog Base Fields (to capture custom model properties)
export type OmitWH<T> = Omit<
  T,
  | 'hashPassword'
  | 'createdAt'
  | 'createdById'
  | 'updatedAt'
  | 'updatedById'
  | 'deletedAt'
  | 'version'
  | 'ownerId'
  | 'getOwnerId'
  | 'setOwnerId'
  | 'id'
  | 'getId'
  | 'setId'
  | 'getValue'
>;

export type QueueMeta = {
  meta: {
    userId: string;
    traceId: string;
  };
};

export interface JobProcessorOptions<T = undefined> {
  binding: Binding;
  config: ConfigService;
  redisOptions: RedisOptions;
  container: typeof Container;
  data: T;
  dbConnection: Connection;
  debug: typeof Debug.log;
  getQueue: (name: string) => Queue;
  job?: Job<QueuePayload<T>>;
  logger: Logger;
  notifier: NotificationService;
  userId: string;
  systemUserId: string;
}

export type QueueEventEntry = ((queueEvents: QueueEvents) => void) | string;

export interface BatchJob<T = undefined> {
  name: string;
  data?: T | T[]; // TODO: I'm not sure what this is actually used for, we should remove
  events?: QueueEventEntry[];
  process: (options: JobProcessorOptions<T>) => Promise<any>;
  scheduler?: boolean;
  schedule?: JobsOptions;
  limiter?: RateLimiterOptions;
}

export type QueuePayload<T = undefined> = {
  data: T;
} & QueueMeta;
