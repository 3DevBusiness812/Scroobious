import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { PitchWrittenFeedback } from './pitch-written-feedback.model';

const EVENT_TYPE = 'pitch_written_feedback.request';

const queue: BatchJob<PitchWrittenFeedback> = {
  name: EVENT_TYPE,
  process,
};

async function process({
  debug,
  data,
  notifier,
  userId,
}: JobProcessorOptions<PitchWrittenFeedback>): Promise<void> {
  debug(`processing ${EVENT_TYPE}: ${JSON.stringify(data)}`);

  return notifier.trackUser(userId, EVENT_TYPE);
}

export default queue;
