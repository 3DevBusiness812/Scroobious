import 'reflect-metadata';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { PermissionService } from '../../src/modules/access-management/permission/permission.service';
import { RolePermissionService } from '../../src/modules/access-management/role-permission/role-permission.service';
import { RoleService } from '../../src/modules/access-management/role/role.service';
import { UserRoleService } from '../../src/modules/access-management/user-role/user-role.service';

export async function createRole(code: string, name: string) {
  await getDBConnection();
  const roleService = getContainer(RoleService);
  return roleService.createIfNotExists(
    {
      code,
    },
    { name },
    '1'
  );
}

export async function createPermission(code: string, description: string) {
  await getDBConnection();
  const permissionService = getContainer(PermissionService);
  return permissionService.createIfNotExists(
    {
      code,
    },
    { description },
    '1'
  );
}

export async function createRolePermission(roleCode: string, permissionCode: string) {
  await getDBConnection();
  const rolePermissionService = getContainer(RolePermissionService);
  const roleService = getContainer(RoleService);
  const permissionService = getContainer(PermissionService);

  const role = await roleService.findOne({ code: roleCode });
  const permission = await permissionService.findOne({ code: permissionCode });

  await rolePermissionService.createIfNotExists(
    {
      roleId: role.id,
      permissionId: permission.id,
    },
    {},
    '1'
  );
}

export async function deleteRolePermission(roleCode: string, permissionCode: string) {
  await getDBConnection();
  const rolePermissionService = getContainer(RolePermissionService);
  const roleService = getContainer(RoleService);
  const permissionService = getContainer(PermissionService);

  const role = await roleService.findOne({ code: roleCode });
  const permission = await permissionService.findOne({ code: permissionCode });

  await rolePermissionService.delete(
    {
      roleId: role.id,
      permissionId: permission.id,
    },
    '1'
  );
}

export async function createUserRole(userId: string, roleCode: string) {
  await getDBConnection();
  const userRoleService = getContainer(UserRoleService);
  const roleService = getContainer(RoleService);
  const role = await roleService.findOne({ code: roleCode });

  return userRoleService.createIfNotExists(
    {
      userId,
      roleId: role.id,
    },
    {},
    '1'
  );
}
