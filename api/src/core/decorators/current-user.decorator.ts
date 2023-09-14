import { createParamDecorator, ResolverData } from 'type-graphql';

import { BaseContext } from '../';

export function CurrentUser(): ParameterDecorator {
  return createParamDecorator(({ context }: ResolverData<BaseContext>) => {
    if (!context?.user) {
      throw new Error('`user` attribute not found on context');
    }
    return context.user;
  });
}
