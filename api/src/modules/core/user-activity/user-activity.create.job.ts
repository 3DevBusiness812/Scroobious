import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { UserActivity } from './user-activity.model';

const EVENT_TYPE = 'user_activity.create';

const queue: BatchJob<UserActivity> = {
  name: EVENT_TYPE,
  process,
};

async function process({
  debug,
  data,
  notifier,
  userId,
}: JobProcessorOptions<UserActivity>): Promise<void> {
  debug(`processing ${EVENT_TYPE}: ${JSON.stringify(data)}`);
  // TODO: should we whitelist event types?
  const eventType = `user_activity.${data.eventType}`;

  return notifier.trackUser(userId, eventType);
}

export default queue;
