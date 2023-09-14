import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { Pitch } from './pitch.model';

const EVENT_TYPE = 'pitch.unpublish';

const queue: BatchJob<Pitch> = {
  name: EVENT_TYPE,
  process,
};

async function process({
  debug,
  data,
  binding,
  notifier,
  userId,
}: JobProcessorOptions<Pitch>): Promise<void> {
  debug(`processing ${EVENT_TYPE}: ${JSON.stringify(data)}`);

  const pitch = await binding.query.pitch(
    { where: { id: data.id } },
    `{
      id
      user {
        id
        email
        firstName
      }
      updatedBy {
        id
        email
        firstName
      }
    }`
  );
  // console.log('pitch :>> ', pitch);

  return notifier.trackUser(userId, EVENT_TYPE, { founder: (pitch as any).user });
}

export default queue;
