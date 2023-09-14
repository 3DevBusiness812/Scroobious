import { getContainer } from '../../../core';
import { BatchJob, JobProcessorOptions } from '../../../core/types'
import { UserService } from '../../identity/user/user.service';
import { CourseService } from '../../courses/course/course.service';
import { CourseProductService } from '../../courses/course-product/course-product.service';
import { CalendlyWebhookEvent } from './calendly-webhook-event.model';

const EVENT_TYPE = 'calendly_webhook_event.create';

const queue: BatchJob<CalendlyWebhookEvent> = {
  name: EVENT_TYPE,
  process
};

async function process({
  debug,
  data,
  userId,
}: JobProcessorOptions<CalendlyWebhookEvent>): Promise<void> {
  console.log('userId :>>', userId);
  console.log('data :>>', data);

  const userService = getContainer(UserService);
  const courseService = getContainer(CourseService);
  const courseProductService = getContainer(CourseProductService);

  debug(`processing ${EVENT_TYPE}: ${JSON.stringify(data)}`);

  const calendlyEventType = data.type;

  console.log('calendlyEventType :>> ', calendlyEventType);

  switch (calendlyEventType) {
    case 'invitee.created':
      console.log("Email =>", (data as any).raw?.payload?.email);


    default:
      'I am default';
  }

}

export default queue;