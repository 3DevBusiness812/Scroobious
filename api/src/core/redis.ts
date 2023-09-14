import Redis from 'ioredis';
import { ConfigService, getContainer } from '.';

let connection: Redis.Redis;

export function getRedisConnectionOptions() {
  const config = getContainer(ConfigService);
  const port = parseInt(config.get('REDIS_PORT'), 10) || 6379;
  const host = config.get('REDIS_HOST');
  const password = config.get('REDIS_PASSWORD');
  if (!port) {
    throw new Error('Redis port is required');
  }
  if (!host) {
    throw new Error('Redis host is required');
  }
  if (!password) {
    throw new Error('Redis password is required');
  }

  return {
    port,
    host,
    password,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };
}

export function getRedisConnection() {
  const config = getContainer(ConfigService);

  if (connection) {
    return connection;
  }

  connection = new Redis(config.get('REDIS_URL'));

  return connection;
}
