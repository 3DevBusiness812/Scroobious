// import { faker } from '@faker-js/faker';
import { ApolloError } from 'apollo-server-core';
import { GraphQLError } from 'graphql';
import { getBindingError, getRemoteBinding, logger } from 'warthog';
import { ConfigService } from './config.service';
import { getContainer } from './di';

// import { Binding } from '../../generated/binding';
type Binding = any;

export async function bindRemote(url?: string, token?: string) {
  const config = getContainer(ConfigService);
  const serverUrl = url || config.getApiUrl('/graphql');

  let binding: Binding;
  try {
    binding = (await getRemoteBinding(serverUrl, {
      origin: 'warthog',
      token,
      // ...options
    })) as unknown as Binding;
    return binding;
  } catch (error) {
    if (error instanceof ApolloError) {
      if (error.result && error.result.errors) {
        const messages = error.result.errors.map((item: any) => item.message);
        logger.error(JSON.stringify(messages));
        throw new Error(JSON.stringify(messages));
      }
    }
    logger.error(error);
    throw error;
  }
}

interface APIError {
  message: string;
  path?: string[];
  extensions: {
    code: string;
    exception?: {
      stacktrace: string[];
    };
  };
}

// Calls our API returning the error object if encountered
// Use this if you want to test errors
export async function callAPI<E>(promise: Promise<E>): Promise<E | APIError> {
  try {
    return (await promise) as E;
  } catch (error) {
    return getBindingError(error) as APIError;
  }
}

// Calls our API, throwing an error if encountered
// Use this if a failed API call should fail our test
// This allows us to write more succinct code in our tests because we don't need to
// Type guard around potentially failed error reponses
export async function callAPISuccess<E>(promise: Promise<E>): Promise<E> {
  const response = await callAPI<E>(promise);

  if (isError(response)) {
    let error: any = response;
    if (typeof response === 'object') {
      error = JSON.stringify(response, undefined, 2);
    }

    throw new Error(String(error));
  }

  return response;
}

// Calls our API, throwing an error if encountered
// Use this if a failed API call should fail our test
// This allows us to write more succinct code in our tests because we don't need to
// Type guard around potentially failed error reponses
export async function callAPIError<E>(promise: Promise<E>): Promise<APIError> {
  const response = await callAPI<E>(promise);

  if (!isError(response)) {
    throw new Error(`Expected an error in this API call: ${JSON.stringify(response)}`);
  }

  // The binding coerces errors of type GraphQL Error into an actual error object
  // instead of the raw JSON, so we need special handling
  if (response instanceof GraphQLError) {
    return {
      message: response.message,
      extensions: {
        code: 'GRAPHQL_ERROR',
      },
    };
  }

  return response;
}

// Checks to see if API response is an error by going through extensions node
export function isError<E>(response: E | APIError): response is APIError {
  // TODO: for some reason the binding returns GraphQLErrors differently
  // Hide this in the future
  if (response instanceof GraphQLError) {
    return true;
  }

  const extensions = (response as APIError).extensions;
  return extensions && extensions.code !== undefined;

  // if (extensions && extensions.code !== undefined) {
  //   return true;
  // }

  // // Handle class-validator errors
  // const validationErrors = (response as any).validationErrors;

  // return validationErrors && validationErrors.length;
}
