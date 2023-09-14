import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { Pitch } from './pitch.model';
import {CustomerIoUser} from '../../core/notifications/notification.service'

const EVENT_TYPE = 'pitch.publish';
const INVESTOR_EVENT_TYPE = 'investor.pitch.publish';

const queue: BatchJob<Pitch> = {
  name: EVENT_TYPE,
  process,
};

async function process({
  dbConnection,
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
      organization {
        startup {
          industries
          fundraiseStatus
          stateProvince
          companyStage
          revenue
          name
          shortDescription
          tinyDescription
        }
      }
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

  await notifier.trackUser(userId, EVENT_TYPE, { founder: (pitch as any).user });

  if ((pitch as any).user?.email) {
    const identifyUser: CustomerIoUser = {
      email: (pitch as any).user?.email,
      pitchPublished: true,
    };

    await notifier.identify(identifyUser);
  }

  const investors = await dbConnection.manager.query(`
    SELECT 
      u.id,
      pus.id as pitch_user_status_id
    FROM 
        public.user u
    LEFT JOIN pitch_user_status pus ON pus.user_id = u.id AND pus.pitch_id = '${(pitch as any).id}'
    WHERE u.status = 'ACTIVE' 
      AND 'INVESTOR'  = ANY(u.capabilities)
      AND (pus.id IS NULL OR pus.notified = false)
  `);

  console.log('pitch.publish.job.ts: investors to be notified:', investors);

  for (let i = 0; i < (investors || []).length; i++) {
    await notifier.trackUser(investors[i].id, INVESTOR_EVENT_TYPE, {
      pitchId: (pitch as any).id,
      startup: (pitch as any).organization?.startup,
      url: `/investor/pitches/${pitch.id}`,
      founder: (pitch as any).user
    });

    if (investors[i].pitch_user_status_id) {
      console.log('pitch.publish.job.ts: update notified status:', investors[i]);
      await dbConnection.manager.query(`
        UPDATE 
            pitch_user_status 
        SET 
            notified = true 
        WHERE 
            id = '${investors[i].pitch_user_status_id}'
      `);
    } else {
      console.log('pitch.publish.job.ts: insert empty record for notified status:', investors[i]);
      await dbConnection.manager.query(`
        INSERT INTO 
            pitch_user_status (id, created_by_id, version, owner_id, user_id, pitch_id, notified)
        VALUES 
            (nanoid(), 1, 1, '${investors[i].id}', '${investors[i].id}', '${(pitch as any).id}', true)
      `);
    }
  }

  return;
}

export default queue;
