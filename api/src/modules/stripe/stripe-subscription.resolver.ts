import { Field, ObjectType, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { UserId } from 'warthog';
import { StripeSubscriptionService } from './stripe-subscription.service';

@ObjectType()
export class ManageStripeSubscriptionResponse {
  @Field({ nullable: false })
  url!: string;
}

@Resolver()
export class SubscriptionResolver {
  constructor(
    @Inject('StripeSubscriptionService') public readonly service: StripeSubscriptionService
  ) {}

  @Query(() => ManageStripeSubscriptionResponse)
  async manageStripeSubscription(@UserId() userId: string): Promise<{ url: string }> {
    return this.service.manage(userId);
  }
}
