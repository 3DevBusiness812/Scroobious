import { createParamDecorator, ResolverData } from 'type-graphql';

import { BaseContext } from '..';

// TODO: DOCUMENTATION
export function MyWorldOwner(ownerIdColumn = 'ownerId'): ParameterDecorator {
  return createParamDecorator(({ context }: ResolverData<BaseContext>) => {
    if (!context?.user) {
      throw new Error('`user` attribute not found on context');
    }
    const isSystemAdmin =
      context.user.permissions && context.user.permissions.includes('system:admin');

    if (isSystemAdmin) {
      return {}; // System admins should not have subfiltering
    }

    return { [ownerIdColumn]: context.user.id };
  });
}
