import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { Fields, UserId } from 'warthog';
import { UserInviteCreateInput, UserInviteWhereArgs } from '../../../../generated';
import { Permission } from '../../../core';
import { UserInvite } from './user-invite.model';
import { UserInviteService } from './user-invite.service';

@Resolver(UserInvite)
export class UserInviteResolver {
  constructor(@Inject('UserInviteService') public readonly service: UserInviteService) {}

  @Permission('user_invite:list')
  @Query(() => [UserInvite])
  async userInvites(
    @Args() { where, orderBy, limit, offset }: UserInviteWhereArgs,
    @Fields() fields: string[]
  ): Promise<UserInvite[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @Permission('user_invite:create')
  @Mutation(() => UserInvite)
  async createUserInvite(
    @Arg('data') data: UserInviteCreateInput,
    @UserId() userId: string
  ): Promise<UserInvite> {
    return this.service.create(data, userId);
  }
}
