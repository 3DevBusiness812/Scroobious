import { getContainer } from '../src/core/di';
import { EventTypeService } from '../src/modules/subscriptions/event-type/event-type.service';
import { SubscriptionType } from '../src/modules/subscriptions/subscription/subscription.model';
import { SubscriptionService } from '../src/modules/subscriptions/subscription/subscription.service';

export async function seedSubscriptions({ userId }: { userId: string }) {
  const eventTypeService = getContainer(EventTypeService);
  const subscriptionService = getContainer(SubscriptionService);

  const eventType = await eventTypeService.create(
    {
      name: 'conversation_message.create',
      allowSubscription: true,
    },
    userId
  );

  await subscriptionService.create(
    {
      eventTypeId: eventType.name,
      type: SubscriptionType.JOB,
      jobId: 'conversation_message.create.email-participant',
    },
    userId
  );
}
