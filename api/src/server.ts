const cors = require('cors');
import { GraphQLRequestContext, GraphQLResponse } from 'apollo-server-core';
import { Application, NextFunction, Request as ExpressRequest } from 'express';
import jwt from 'express-jwt';
import { GraphQLError } from 'graphql';
// @ts-ignore
import { decode } from 'jsonwebtoken';
import 'reflect-metadata';
import { BaseContext, Server } from 'warthog';
import { ConfigService, getContainer, Logger, UserContext } from './core';
import { MyStrategy } from './db/naming-strategy';
const cookie = require('cookie');

interface Context extends BaseContext {
  user: UserContext;
}

interface Request extends ExpressRequest {
  token?: string | null;
}

export function getServer(dbOptions = {}) {
  const logger = getContainer<typeof Logger>(Logger);

  return new Server<Context>(
    {
      context: async (request: Request) => {
        // console.log('context: request');
        // console.log(`request.user`, request.user);
        // console.log(`request.token`, request.token);
        // console.log(`request.headers`, request.headers);
        // console.log(`request.headers.cookie`, request.headers.cookie);
        // console.log(`request.cookies`, request.cookies);
        // console.log(`request.body`, request.body);
        // console.log(`request.body.operationName`, request.body.operationName);
        // console.log(`request.hostname`, request.hostname);

        if (request.user && (request.user as any).id) {
          return {
            token: request.token,
            user: request.user,
          };
        }

        if (request.headers.cookie) {
          const cookies = cookie.parse(request.headers.cookie);
          const nextCookie =
            cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token'];

          // console.log('nextCookie', nextCookie);
          if (nextCookie) {
            const decodedSession = decode(nextCookie);
            // console.log('decodedSession', decodedSession);
            if (decodedSession) {
              // console.log('decoded.apiToken', (decodedSession as any).apiToken);
              const decodedAccessToken = decode((decodedSession as any).apiToken);
              // console.log(`decodedAccessToken`, decodedAccessToken);

              if (decodedAccessToken) {
                return {
                  token: request.token,
                  user: decodedAccessToken,
                };
              }
            }
          }
        }

        return {
          user: {},
        };
      },

      introspection: true,
      apolloConfig: {
        formatError: (error: GraphQLError) => {
          logger.error('GraphQL API Error', error);
          return error;
        },
        // This formatResponse logs useful request/response information to Datadog
        formatResponse: (
          response: GraphQLResponse | null,
          requestContext: GraphQLRequestContext<object>
        ) => {
          const email = (requestContext as any)?.context?.user?.email || '';
          const request = { ...requestContext.request };
          delete request?.http;
          delete request?.extensions;

          if (!response) {
            throw new Error('Empty GraphQL Response');
          }

          let message = 'GraphQL Request';

          if (response.data) {
            const keys = Object.keys(response.data);
            if (keys.length) {
              message += `: [${keys[0]}]`;
            }
          }

          if (email) {
            message += ` by ${email}`;
          }

          // console.log('requestContext.context.user :>> ', requestContext.context.user);
          // console.log('requestContext.request :>> ', requestContext.request);

          logger.info(message, { request, response });

          return response;
        },
      },
      logger,
      // ...AppOptions,
      onBeforeGraphQLMiddleware: (app: Application) => {
        app.use(
          cors({
            origin: ['https://localhost:3000', 'https://localhost:5001'],
          })
        );

        app.use(function (_1: unknown, req: Request, _2: unknown, next: NextFunction) {
          // console.log('req.headers', req.headers);
          logger.info('Request body', req.body);

          if (!req.headers.authorization) {
            req.token = null;
            return next();
          }

          const parts = req.headers.authorization.split(' ');
          if (parts.length !== 2) {
            req.token = null;
            return next();
          }

          const scheme = parts[0];
          const credentials = parts[1];

          if (!/^Bearer$/i.test(scheme)) {
            req.token = null;
          } else {
            req.token = credentials;
          }
          return next();
        });

        const config = getContainer(ConfigService);
        app.use(
          jwt({
            secret: config.get('JWT_SECRET'),
            credentialsRequired: false,
            algorithms: ['HS512'],
            getToken(req: ExpressRequest) {
              if (
                req.headers.authorization &&
                req.headers.authorization.split(' ')[0] === 'Bearer'
              ) {
                return req.headers.authorization.split(' ')[1];
              } else {
                if (req.headers.cookie) {
                  const cookies = cookie.parse(req.headers.cookie);
                  const nextCookie =
                    cookies['next-auth.session-token'] ||
                    cookies['__Secure-next-auth.session-token'];
                  // console.log('AUTH-HEADER-TOKEN-MISSING: nextCookie', nextCookie);
                  if (nextCookie) {
                    const decodedSession = decode(nextCookie);
                    // console.log('AUTH-HEADER-TOKEN-MISSING: decodedSession', decodedSession);
                    if (decodedSession) {
                      // console.log(
                      //   'AUTH-HEADER-TOKEN-MISSING: decoded.apiToken',
                      //   (decodedSession as any).apiToken
                      // );
                      // const decodedAccessToken = decode((decodedSession as any).apiToken);
                      // console.log(
                      //   `AUTH-HEADER-TOKEN-MISSING: decodedAccessToken`,
                      //   decodedAccessToken
                      // );
                      return (decodedSession as any).apiToken;
                    }
                  }
                }
              }

              return null;
            },
          })
        );
      },
    },
    {
      namingStrategy: new MyStrategy(),
    }
  );
}
