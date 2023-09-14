import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { Fields, StandardDeleteResponse, UserId } from 'warthog';
import {
  PermissionCreateInput,
  PermissionCreateManyArgs,
  PermissionUpdateArgs,
  PermissionWhereArgs,
  PermissionWhereUniqueInput,
} from '../../../../generated';
import { Permission as RequirePermission } from '../../../core';
import { Permission } from './permission.model';
import { PermissionService } from './permission.service';

@Resolver(Permission)
export class PermissionResolver {
  constructor(@Inject('PermissionService') public readonly service: PermissionService) {}

  @RequirePermission(['permission:read', 'permission:admin'])
  @Query(() => [Permission])
  async permissions(
    @Args() { where, orderBy, limit, offset }: PermissionWhereArgs,
    @Fields() fields: string[]
  ): Promise<Permission[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  // Custom resolver that has it's own InputType and calls into custom service method
  @Query(() => [String])
  async permissionsForUser(@UserId() userId: string): Promise<string[]> {
    // console.log('userId :>> ', userId);

    return this.service.permissionsForUser(userId);
  }

  @RequirePermission('permission:admin')
  @Query(() => Permission)
  async permission(@Arg('where') where: PermissionWhereUniqueInput): Promise<Permission> {
    return this.service.findOne<PermissionWhereUniqueInput>(where);
  }

  @RequirePermission('permission:admin')
  @Mutation(() => Permission)
  async createPermission(
    @Arg('data') data: PermissionCreateInput,
    @UserId() userId: string
  ): Promise<Permission> {
    return this.service.create(data, userId);
  }

  @RequirePermission('permission:admin')
  @Mutation(() => [Permission])
  async createManyPermissions(
    @Args() { data }: PermissionCreateManyArgs,
    @UserId() userId: string
  ): Promise<Permission[]> {
    return this.service.createMany(data, userId);
  }

  @RequirePermission('permission:admin')
  @Mutation(() => Permission)
  async updatePermission(
    @Args() { data, where }: PermissionUpdateArgs,
    @UserId() userId: string
  ): Promise<Permission> {
    return this.service.update(data, where, userId);
  }

  @RequirePermission('permission:admin')
  @Mutation(() => StandardDeleteResponse)
  async deletePermission(
    @Arg('where') where: PermissionWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
