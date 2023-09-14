import { Container } from 'typedi';
import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { EventStatus } from './event.model';
// import { WebhookQueue } from './event.process-subscription.job.ts.bak';
import { EventService } from './event.service';

// import { Event } from './event.model';
// import { Subscription } from '../subscription/subscription.model';

Container.import([EventService]);
const eventService: EventService = Container.get('EventService');

const queue: BatchJob = {
  name: 'event-poll-and-queue',
  process,
  schedule: {
    repeat: {
      every: 10 * 1000,
    },
  },
  scheduler: true,
};

async function process({ debug, userId, getQueue }: JobProcessorOptions): Promise<void> {
  const events = await eventService.find({
    status_eq: EventStatus.NEW,
  });
  debug(`# events: ${events.length}`);

  if (!events.length) {
    return; // console.log('No events to process');
  }

  for (let i = 0; i < events.length; i++) {
    // TODO: do we need to lock the event here?
    const thisEvent = events[i];
    const { id, type, ownerId } = thisEvent;
    // console.log('thisEvent :>> ', thisEvent);
    // console.log('Type :>> ', type);

    try {
      const queue = getQueue(type);
      if (queue) {
        debug(`Adding queue item: ${type} - ${thisEvent.id}`);
        await queue.add(`${type}-${thisEvent.id}`, {
          data: (thisEvent.payload as any).resource,
          meta: {
            userId: (thisEvent.payload as any).resource.createdById, // TODO: fix as this should come from API
            traceId: 'TODO: add this',
          },
        });

        debug(`Updating item to processed: ${thisEvent.id}`);
        await eventService.update({ status: EventStatus.PROCESSED }, { id: thisEvent.id }, userId);
      } else {
        await eventService.update({ status: EventStatus.SKIPPED }, { id: thisEvent.id }, userId);
      }
    } catch (error) {
      await eventService.update(
        { status: EventStatus.FAILED, statusMessage: (error as Error).message },
        { id: thisEvent.id },
        userId
      );
      debug(`Updating item to failed: ${thisEvent.id}`);
      console.error(error);
    }
  }

  // We're not going to look for subscriptions for now.  We'll look at all events and see if there is a queue
  // If there is a queue to handle the event, we'll run the event
  //   const subscriptions = await subscriptionService.find({ eventTypeId_eq: type });
  //   // console.log('# Subscriptions', subscriptions.length);

  // for (let j = 0; j < subscriptions.length; j++) {
  //   const subscription = subscriptions[i];

  //   if (subscription.type === SubscriptionType.JOB) {
  //     const queue =  getQueue(subscription.eventTypeId);

  //     // console.log(`Creating ${subscription.eventTypeId} job for event ${thisEvent.id}`);

  //     await queue.add(`${subscription.jobId}-${thisEvent.id}`, {
  //       data: (thisEvent.payload as any).resource,
  //       meta: {
  //         userId,
  //         traceId: 'TODO: add this',
  //       },
  //     });
  //   } else if (subscription.type === SubscriptionType.WEBHOOK) {
  //     // TODO: need to make sure we handle partial success here
  //     // await WebhookQueue.add({
  //     //   event: thisEvent,
  //     //   subscription: subscription,
  //     // });
  //   }
  // }
}

export default queue;
