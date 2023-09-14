import { HttpResponseUnauthorized } from '@foal/core';
import { createMethodDecorator } from 'type-graphql';
import { StringMap } from 'warthog';

interface BaseContext {
  token: string;
  request: {
    headers: StringMap;
  };
}

export const JWTRequired = <Context extends BaseContext>() => {
  return createMethodDecorator<Context>(async ({ context }, next) => {
    if (!(context.request as any).user) {
      throw new HttpResponseUnauthorized();
    }

    return next();
  });
};
