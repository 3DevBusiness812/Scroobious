import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { Course } from './course.model';

const EVENT_TYPE = 'course.complete';

const queue: BatchJob<Course> = {
  name: EVENT_TYPE,
  process,
};

async function process({
  debug,
  data,
  notifier,
  userId,
}: JobProcessorOptions<Course>): Promise<void> {
  debug(`processing ${EVENT_TYPE}: ${JSON.stringify(data)}`);

  return notifier.trackUser(userId, EVENT_TYPE);
}

export default queue;
