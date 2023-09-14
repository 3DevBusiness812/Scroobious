import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields, StandardDeleteResponse, UserId } from 'warthog';

import {
  UserRoleCreateInput,
  UserRoleCreateManyArgs,
  UserRoleUpdateArgs,
  UserRoleWhereArgs,
  UserRoleWhereUniqueInput,
} from '../../../../generated';

import { Permission as RequirePermission } from '../../../core';

// import { User } from '../../user/user.model';
import { Role } from '../role/role.model';

import { UserRole } from './user-role.model';
import { UserRoleService } from './user-role.service';

@Resolver(UserRole)
export class UserRoleResolver {
  constructor(@Inject('UserRoleService') public readonly service: UserRoleService) {}

  // @Authorized('user:read')
  // @FieldResolver(() => User)
  // user(@Root() userRole: UserRole, @Ctx() ctx: BaseContext): Promise<User> {
  //   return ctx.dataLoader.loaders.UserRole.user.load(userRole);
  // }

  @RequirePermission('role:admin')
  @FieldResolver(() => Role)
  role(@Root() userRole: UserRole, @Ctx() ctx: BaseContext): Promise<Role> {
    return ctx.dataLoader.loaders.UserRole.role.load(userRole);
  }

  @RequirePermission('user-role:admin')
  @Query(() => [UserRole])
  async userRoles(
    @Args() { where, orderBy, limit, offset }: UserRoleWhereArgs,
    @Fields() fields: string[]
  ): Promise<UserRole[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @RequirePermission('user-role:admin')
  @Query(() => UserRole)
  async userRole(@Arg('where') where: UserRoleWhereUniqueInput): Promise<UserRole> {
    return this.service.findOne<UserRoleWhereUniqueInput>(where);
  }

  @RequirePermission('user-role:admin')
  @Mutation(() => UserRole)
  async createUserRole(
    @Arg('data') data: UserRoleCreateInput,
    @UserId() userId: string
  ): Promise<UserRole> {
    return this.service.create(data, userId);
  }

  @RequirePermission('user-role:admin')
  @Mutation(() => [UserRole])
  async createManyUserRoles(
    @Args() { data }: UserRoleCreateManyArgs,
    @UserId() userId: string
  ): Promise<UserRole[]> {
    return this.service.createMany(data, userId);
  }

  @RequirePermission('user-role:admin')
  @Mutation(() => UserRole)
  async updateUserRole(
    @Args() { data, where }: UserRoleUpdateArgs,
    @UserId() userId: string
  ): Promise<UserRole> {
    return this.service.update(data, where, userId);
  }

  @RequirePermission('user-role:admin')
  @Mutation(() => StandardDeleteResponse)
  async deleteUserRole(
    @Arg('where') where: UserRoleWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
