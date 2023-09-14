import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields, StandardDeleteResponse, UserId } from 'warthog';
import {
  AuthAccountCreateInput,
  AuthAccountWhereArgs,
  AuthAccountWhereUniqueInput,
} from '../../../../generated';
import { User } from '../user/user.model';
import { AuthAccount } from './auth-account.model';
import { AuthAccountService } from './auth-account.service';

@Resolver(AuthAccount)
export class AuthAccountResolver {
  constructor(@Inject('AuthAccountService') public readonly service: AuthAccountService) {}

  // @RequirePermission('role:admin')
  @FieldResolver(() => User)
  user(@Root() authAccount: AuthAccount, @Ctx() ctx: BaseContext): Promise<User> {
    return ctx.dataLoader.loaders.AuthAccount.user.load(authAccount);
  }

  @Query(() => [AuthAccount])
  async authAccounts(
    @Args() { where, orderBy, limit, offset }: AuthAccountWhereArgs,
    @Fields() fields: string[]
  ): Promise<AuthAccount[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @Mutation(() => AuthAccount)
  async createAuthAccount(
    @Arg('data') data: AuthAccountCreateInput,
    @UserId() userId: string
  ): Promise<AuthAccount> {
    return this.service.create(data, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteAuthAccount(
    @Arg('where') where: AuthAccountWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
