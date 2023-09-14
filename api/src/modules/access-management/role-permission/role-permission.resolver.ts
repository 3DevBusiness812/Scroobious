import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields, StandardDeleteResponse, UserId } from 'warthog';
import {
  RolePermissionCreateInput,
  RolePermissionCreateManyArgs,
  RolePermissionUpdateArgs,
  RolePermissionWhereArgs,
  RolePermissionWhereUniqueInput,
} from '../../../../generated';
import { Permission as RequirePermission } from '../../../core';
import { Permission } from '../permission/permission.model';
import { RolePermission } from '../role-permission/role-permission.model';
import { Role } from '../role/role.model';
import { RolePermissionService } from './role-permission.service';

@Resolver(RolePermission)
export class RolePermissionResolver {
  constructor(@Inject('RolePermissionService') public readonly service: RolePermissionService) {}

  @RequirePermission('permission:admin')
  @FieldResolver(() => Permission)
  permission(@Root() rolePermission: RolePermission, @Ctx() ctx: BaseContext): Promise<Permission> {
    return ctx.dataLoader.loaders.RolePermission.permission.load(rolePermission);
  }

  @RequirePermission('role:admin')
  @FieldResolver(() => Role)
  role(@Root() rolePermission: RolePermission, @Ctx() ctx: BaseContext): Promise<Role> {
    return ctx.dataLoader.loaders.RolePermission.role.load(rolePermission);
  }

  @RequirePermission('role-permission:admin')
  @Query(() => [RolePermission])
  async rolePermissions(
    @Args() { where, orderBy, limit, offset }: RolePermissionWhereArgs,
    @Fields() fields: string[]
  ): Promise<RolePermission[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @RequirePermission('role-permission:admin')
  @Query(() => RolePermission)
  async rolePermission(
    @Arg('where') where: RolePermissionWhereUniqueInput
  ): Promise<RolePermission> {
    return this.service.findOne<RolePermissionWhereUniqueInput>(where);
  }

  @RequirePermission('role-permission:admin')
  @Mutation(() => RolePermission)
  async createRolePermission(
    @Arg('data') data: RolePermissionCreateInput,
    @UserId() userId: string
  ): Promise<RolePermission> {
    return this.service.create(data, userId);
  }

  @RequirePermission('role-permission:admin')
  @Mutation(() => [RolePermission])
  async createManyRolePermissions(
    @Args() { data }: RolePermissionCreateManyArgs,
    @UserId() userId: string
  ): Promise<RolePermission[]> {
    return this.service.createMany(data, userId);
  }

  @RequirePermission('role-permission:admin')
  @Mutation(() => RolePermission)
  async updateRolePermission(
    @Args() { data, where }: RolePermissionUpdateArgs,
    @UserId() userId: string
  ): Promise<RolePermission> {
    return this.service.update(data, where, userId);
  }

  @RequirePermission('role-permission:admin')
  @Mutation(() => StandardDeleteResponse)
  async deleteRolePermission(
    @Arg('where') where: RolePermissionWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
