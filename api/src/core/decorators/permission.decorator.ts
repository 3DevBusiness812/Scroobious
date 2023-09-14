import { createMethodDecorator } from 'type-graphql';
import { BaseContext, getContainer } from '..';
import { PermissionService } from '../../modules/access-management/permission/permission.service';

export const Permission = <Context extends BaseContext>(name: string | string[]) => {
  return createMethodDecorator<Context>(async ({ context }, next) => {
    const permissionsArray = Array.isArray(name) ? name : [name];
    // console.log('Permission decorator :>> ', name);
    // console.log('context.user :>> ', context.user);
    // console.log('context :>> ', context);

    if (!context.user || !context.user.id) {
      throw new Error('Permission decorator: user not found');
    }

    const permissionService = getContainer(PermissionService);

    // PERFORMANCE: we need to cache these permissions instead of getting them on each API call
    const userPermissions = await permissionService.permissionsForUser(context.user.id);
    // console.log('userPermissions :>> ', userPermissions);

    if (!userPermissions || !Array.isArray(userPermissions) || !userPermissions.length) {
      throw new Error('Permission decorator: user does not have any permissions');
    }
    const isSystemAdmin = userPermissions.includes('system:admin');
    const hasMatchingPermission = permissionsArray.some((perm: string) =>
      userPermissions.includes(perm)
    );

    // console.log('hasMatchingPermission :>> ', hasMatchingPermission);

    if (!isSystemAdmin && !hasMatchingPermission) {
      throw new Error(`Permission decorator: user does not have ${permissionsArray.join(',')}`);
    }

    return next();
  });
};
