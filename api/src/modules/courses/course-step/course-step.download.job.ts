import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { CourseStep } from './course-step.model';

const EVENT_TYPE = 'course_step.download';

const queue: BatchJob<CourseStep> = {
  name: EVENT_TYPE,
  process,
};

async function process({
  debug,
  data,
  binding,
  notifier,
  userId,
}: JobProcessorOptions<CourseStep>): Promise<void> {
  debug(`processing ${EVENT_TYPE}: ${JSON.stringify(data)}`);

  const courseStep = await binding.query.courseStep(
    { where: { id: data.id } },
    `{
      id
      courseStepDefinition {
        id
        config
      }
      createdBy {
        id
        email
        firstName
      }
    }`
  );
  // console.log('courseStep :>> ', courseStep);
  const buttonEventType = courseStep.courseStepDefinition?.config?.buttonEventType;

  if (buttonEventType && typeof buttonEventType === 'string') {
    return notifier.trackUser(userId, `${EVENT_TYPE}.${buttonEventType}`);
  }
}

export default queue;
