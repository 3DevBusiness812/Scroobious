import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { Fields, StandardDeleteResponse, UserId } from 'warthog';
import {
  SessionCreateInput,
  SessionUpdateArgs,
  SessionWhereArgs,
  SessionWhereUniqueInput,
} from '../../../../generated';
import { Session } from './session.model';
import { SessionService } from './session.service';

@Resolver(Session)
export class SessionResolver {
  constructor(@Inject('SessionService') public readonly service: SessionService) {}

  // Needed by NextAuth
  @Query(() => [Session])
  async sessions(
    @Args() { where, orderBy, limit, offset }: SessionWhereArgs,
    @Fields() fields: string[]
  ): Promise<Session[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  // Needed by NextAuth
  @Query(() => Session, { nullable: true })
  async session(@Arg('where') where: SessionWhereUniqueInput): Promise<Session | null> {
    return this.service.findSession(where);
  }

  // Needed by NextAuth
  @Mutation(() => Session)
  async createSession(
    @Arg('data') data: SessionCreateInput,
    @UserId() userId: string
  ): Promise<Session> {
    return this.service.create(data, userId);
  }

  // Needed by NextAuth
  @Mutation(() => Session)
  async updateSession(
    @Args() { data, where }: SessionUpdateArgs,
    @UserId() userId: string
  ): Promise<Session> {
    return this.service.update(data, where, userId);
  }

  // Needed by NextAuth
  @Mutation(() => StandardDeleteResponse)
  async deleteSession(
    @Arg('where') where: SessionWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
