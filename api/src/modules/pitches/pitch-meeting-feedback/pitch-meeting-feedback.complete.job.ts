import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { PitchMeetingFeedback } from './pitch-meeting-feedback.model';

const EVENT_TYPE = 'pitch_meeting_feedback.complete';

const queue: BatchJob<PitchMeetingFeedback> = {
  name: EVENT_TYPE,
  process,
};

async function process({
  debug,
  data,
  notifier,
  userId,
}: JobProcessorOptions<PitchMeetingFeedback>): Promise<void> {
  debug(`processing ${EVENT_TYPE}: ${JSON.stringify(data)}`);

  return notifier.trackUser(userId, EVENT_TYPE);
}

export default queue;
