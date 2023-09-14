import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields, StandardDeleteResponse, UserId } from 'warthog';

import {
  RoleCreateInput,
  RoleCreateManyArgs,
  RoleUpdateArgs,
  RoleWhereArgs,
  RoleWhereUniqueInput,
} from '../../../../generated';

import { Permission as RequirePermission } from '../../../core';

import { Role } from './role.model';
import { RoleService } from './role.service';

@Resolver(Role)
export class RoleResolver {
  constructor(@Inject('RoleService') public readonly service: RoleService) {}

  @RequirePermission('role:admin')
  @FieldResolver(() => Role)
  rolePermissions(@Root() role: Role, @Ctx() ctx: BaseContext): Promise<Role> {
    return ctx.dataLoader.loaders.Role.rolePermissions.load(role);
  }

  @RequirePermission('role:admin')
  @Query(() => [Role])
  async roles(
    @Args() { where, orderBy, limit, offset }: RoleWhereArgs,
    @Fields() fields: string[]
  ): Promise<Role[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @RequirePermission('role:admin')
  @Query(() => Role)
  async role(@Arg('where') where: RoleWhereUniqueInput): Promise<Role> {
    return this.service.findOne<RoleWhereUniqueInput>(where);
  }

  @RequirePermission('role:admin')
  @Mutation(() => Role)
  async createRole(@Arg('data') data: RoleCreateInput, @UserId() userId: string): Promise<Role> {
    return this.service.create(data, userId);
  }

  @RequirePermission('role:admin')
  @Mutation(() => [Role])
  async createManyRoles(
    @Args() { data }: RoleCreateManyArgs,
    @UserId() userId: string
  ): Promise<Role[]> {
    return this.service.createMany(data, userId);
  }

  @RequirePermission('role:admin')
  @Mutation(() => Role)
  async updateRole(
    @Args() { data, where }: RoleUpdateArgs,
    @UserId() userId: string
  ): Promise<Role> {
    return this.service.update(data, where, userId);
  }

  @RequirePermission('role:admin')
  @Mutation(() => StandardDeleteResponse)
  async deleteRole(
    @Arg('where') where: RoleWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
