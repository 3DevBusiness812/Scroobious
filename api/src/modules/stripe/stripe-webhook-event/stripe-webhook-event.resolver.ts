import { Arg, Mutation, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { StripeWebhookEventCreateInput } from '../../../../generated';
import { StripeWebhookEvent } from './stripe-webhook-event.model';
import { StripeWebhookEventService } from './stripe-webhook-event.service';

@Resolver(StripeWebhookEvent)
export class StripeWebhookEventResolver {
  constructor(
    @Inject('StripeWebhookEventService') public readonly service: StripeWebhookEventService
  ) {}

  @Mutation(() => StripeWebhookEvent)
  async createStripeWebhookEvent(
    @Arg('data') data: StripeWebhookEventCreateInput
  ): Promise<StripeWebhookEvent> {
    return this.service.create(data, '1');
  }
}
