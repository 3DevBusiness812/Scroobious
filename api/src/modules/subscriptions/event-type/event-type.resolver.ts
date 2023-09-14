import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { Fields, StandardDeleteResponse, UserId } from 'warthog';

import {
  EventTypeCreateInput,
  EventTypeCreateManyArgs,
  EventTypeUpdateArgs,
  EventTypeWhereArgs,
  EventTypeWhereUniqueInput,
} from '../../../../generated';

import { Permission } from '../../../core';

import { EventType } from './event-type.model';
import { EventTypeService } from './event-type.service';

@Resolver(EventType)
export class EventTypeResolver {
  constructor(@Inject('EventTypeService') public readonly service: EventTypeService) {}

  @Permission('system:admin')
  @Query(() => [EventType])
  async eventTypes(
    @Args() { where, orderBy, limit, offset }: EventTypeWhereArgs,
    @Fields() fields: string[]
  ): Promise<EventType[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @Permission('system:admin')
  @Query(() => EventType)
  async eventType(@Arg('where') where: EventTypeWhereUniqueInput): Promise<EventType> {
    return this.service.findOne<EventTypeWhereUniqueInput>(where);
  }

  @Permission('system:admin')
  @Mutation(() => EventType)
  async createEventType(
    @Arg('data') data: EventTypeCreateInput,
    @UserId() userId: string
  ): Promise<EventType> {
    return this.service.create(data, userId);
  }

  @Permission('system:admin')
  @Mutation(() => [EventType])
  async createManyEventTypes(
    @Args() { data }: EventTypeCreateManyArgs,
    @UserId() userId: string
  ): Promise<EventType[]> {
    return this.service.createMany(data, userId);
  }

  @Permission('system:admin')
  @Mutation(() => EventType)
  async updateEventType(
    @Args() { data, where }: EventTypeUpdateArgs,
    @UserId() userId: string
  ): Promise<EventType> {
    return this.service.update(data, where, userId);
  }

  @Permission('system:admin')
  @Mutation(() => StandardDeleteResponse)
  async deleteEventType(
    @Arg('where') where: EventTypeWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
