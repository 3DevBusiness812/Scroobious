import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { Fields, StandardDeleteResponse, UserId } from 'warthog';
import {
  SubscriptionCreateInput,
  SubscriptionCreateManyArgs,
  SubscriptionUpdateArgs,
  SubscriptionWhereArgs,
  SubscriptionWhereUniqueInput,
} from '../../../../generated';
import { Permission } from '../../../core';
import { Subscription } from './subscription.model';
import { SubscriptionService } from './subscription.service';

@Resolver(Subscription)
export class SubscriptionResolver {
  constructor(@Inject('SubscriptionService') public readonly service: SubscriptionService) {}

  @Permission('system:admin')
  @Query(() => [Subscription])
  async subscriptions(
    @Args() { where, orderBy, limit, offset }: SubscriptionWhereArgs,
    @Fields() fields: string[]
  ): Promise<Subscription[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @Permission('system:admin')
  @Query(() => Subscription)
  async subscription(@Arg('where') where: SubscriptionWhereUniqueInput): Promise<Subscription> {
    return this.service.findOne<SubscriptionWhereUniqueInput>(where);
  }

  @Permission('system:admin')
  @Mutation(() => Subscription)
  async createSubscription(
    @Arg('data') data: SubscriptionCreateInput,
    @UserId() userId: string
  ): Promise<Subscription> {
    return this.service.create(data, userId);
  }

  @Permission('system:admin')
  @Mutation(() => [Subscription])
  async createManySubscriptions(
    @Args() { data }: SubscriptionCreateManyArgs,
    @UserId() userId: string
  ): Promise<Subscription[]> {
    return this.service.createMany(data, userId);
  }

  @Permission('system:admin')
  @Mutation(() => Subscription)
  async updateSubscription(
    @Args() { data, where }: SubscriptionUpdateArgs,
    @UserId() userId: string
  ): Promise<Subscription> {
    return this.service.update(data, where, userId);
  }

  @Permission('system:admin')
  @Mutation(() => StandardDeleteResponse)
  async deleteSubscription(
    @Arg('where') where: SubscriptionWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
