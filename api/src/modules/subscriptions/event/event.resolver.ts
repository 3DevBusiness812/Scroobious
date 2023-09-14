import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { Fields, StandardDeleteResponse, UserId } from 'warthog';

import {
  EventCreateInput,
  EventCreateManyArgs,
  EventUpdateArgs,
  EventWhereArgs,
  EventWhereUniqueInput,
} from '../../../../generated';

import { Permission } from '../../../core';

import { Event } from './event.model';
import { EventService } from './event.service';

@Resolver(Event)
export class EventResolver {
  constructor(@Inject('EventService') public readonly service: EventService) {}

  @Permission('system:admin')
  @Query(() => [Event])
  async events(
    @Args() { where, orderBy, limit, offset }: EventWhereArgs,
    @Fields() fields: string[]
  ): Promise<Event[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @Permission('system:admin')
  @Query(() => Event)
  async event(@Arg('where') where: EventWhereUniqueInput): Promise<Event> {
    return this.service.findOne<EventWhereUniqueInput>(where);
  }

  @Permission('system:admin')
  @Mutation(() => Event)
  async createEvent(@Arg('data') data: EventCreateInput, @UserId() userId: string): Promise<Event> {
    return this.service.create(data, userId);
  }

  @Permission('system:admin')
  @Mutation(() => [Event])
  async createManyEvents(
    @Args() { data }: EventCreateManyArgs,
    @UserId() userId: string
  ): Promise<Event[]> {
    return this.service.createMany(data, userId);
  }

  @Permission('system:admin')
  @Mutation(() => Event)
  async updateEvent(
    @Args() { data, where }: EventUpdateArgs,
    @UserId() userId: string
  ): Promise<Event> {
    return this.service.update(data, where, userId);
  }

  @Permission('system:admin')
  @Mutation(() => StandardDeleteResponse)
  async deleteEvent(
    @Arg('where') where: EventWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
