import { createParamDecorator, ResolverData } from 'type-graphql';
import { BaseContext } from '../';

export function Permissions(): ParameterDecorator {
  return createParamDecorator(({ context }: ResolverData<BaseContext>) => {
    if (!context.user) {
      // console.log(context);
      throw new Error('`user` attribute not found on context');
    }
    return context.user.permissions;
  });
}
