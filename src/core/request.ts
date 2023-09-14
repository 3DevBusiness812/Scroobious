import { GraphQLError } from 'graphql'
import { StringMap } from './querystring'

const get = require('lodash.get')

interface callAPIParams {
  query: string
  operationName: string
  variables: object
  headers?: {
    authorization: string
    [key: string]: string
  }
}

interface SuccessResponse {
  data: any
}

export interface ErrorResponse {
  readonly errors?: GraphQLError[]
}

export function isApiError(response: SuccessResponse | ErrorResponse): response is ErrorResponse {
  // console.log(`error`, error)
  // console.log(`error.errors`, error.errors)
  // console.log(`Array.isArray(error.errors)`, Array.isArray(error.errors))

  return (
    typeof (response as ErrorResponse).errors !== 'undefined' ||
    isApolloError(response) ||
    isApolloGraphQLError(response)
  )
}

export function isApolloError(response: any): response is ErrorResponse {
  return !!get(response, 'errors[0].extensions.errors')
}

export function isApolloGraphQLError(response: any): response is ErrorResponse {
  return !!get(response, 'graphQLErrors[0].extensions.exception.validationErrors')
}

export function isDBError(response: any): response is ErrorResponse {
  return !!get(response, 'graphQLErrors[0].extensions.exception.query')
}

export function isUnhandledError(response: any): response is ErrorResponse {
  return !!get(response, 'message')
}

export function callAPI<T>({ headers, query, operationName, variables }: callAPIParams): Promise<T> {
  if (!process.env.NEXT_PUBLIC_APP_BASE_URL) {
    throw new Error('Environment variable NEXT_PUBLIC_APP_BASE_URL is missing')
  }
  //   if (!headers.authorization) {
  //     throw new Error(`authorization header is required`)
  //   }

  return fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((res) => {
      // console.log('res.ok', res.ok)
      // if (!res.ok) {
      //   return res.blob()
      // }

      // console.log('res :>> ', res)
      return res.json()
    })
    .then((result) => {
      // console.log('result :>> ', result, JSON.stringify(result))
      // Errors should just pass through
      if (result.errors || result.error) {
        return result
      }

      // console.log('callAPI result', result)
      return (operationName ? result.data[operationName] : result.data) as unknown as T
    })
}

// This pulls an error object of the form
// {
//    "fieldName": "error message"
//    i.e.
//    "email": "User with email <email> already exists"
// }
// See user.service.ts -> register in the API
export function extractErrors(payload: ErrorResponse): StringMap | null {
  // console.log('extractErrors :>> ', payload)
  const err = payload as any

  // console.log('typeof err :>> ', typeof err)
  // console.log('Object.keys(err) :>> ', Object.keys(err))
  // console.log('err.errors :>> ', err.errors)

  // console.log('graphQLErrors', err.graphQLErrors)
  // console.log('clientErrors', err.clientErrors)
  // console.log('networkError', err.networkError)
  // console.log('message', err.message)
  // console.log('extraInfo', err.extraInfo)

  // Handle general Apollo errors
  if (isApolloError(payload)) {
    return payload?.errors?.[0]?.extensions?.errors
  }

  let validationErrors
  if (Array.isArray(err.errors)) {
    const first = err.errors[0]
    if (first && first.extensions) {
      validationErrors = first.extensions.exception.validationErrors
    }
  }

  // Handle Apollo graphQLErrors instances
  if (isApolloGraphQLError(payload)) {
    validationErrors = get(payload, 'graphQLErrors[0].extensions.exception.validationErrors') as any[]
  }

  if (validationErrors) {
    return validationErrors.reduce((prev: any, curr: any) => {
      const constraintKey = Object.keys(curr.constraints)[0]
      // console.log('prev :>> ', prev)
      // console.log('curr :>> ', curr)
      prev[curr.property] = curr.constraints[constraintKey]
      return prev
    }, {})
  }

  if (isDBError(payload)) {
    return {
      global: 'Unspecified Error - please contact support',
    }
  }
  if (isUnhandledError(payload)) {
    return {
      global: 'Unspecified Error - please contact support',
    }
  }

  // Handle custom errors thrown by Warthog
  const customWarthogErrorProperty = get(payload, 'graphQLErrors[0].extensions.property')
  // console.log('customWarthogErrorProperty :>> ', customWarthogErrorProperty)

  if (customWarthogErrorProperty) {
    const response = {
      [get(payload, 'graphQLErrors[0].extensions.property')]: get(payload, 'graphQLErrors[0].message'),
    }
    // console.log('response :>> ', response)
    return response
  }

  if (err.errors && err.errors.length && err.errors[0].message) {
    return {
      global: err.errors[0].message,
    }
  }

  return null
}

export async function handleApolloMutation(mutationPromise: Promise<any>) {
  let payload

  try {
    payload = await mutationPromise
    // console.log('payload success :>> ', payload)
    // console.log('handleApolloMutation result  :>> ', result)
  } catch (errorResponse) {
    // console.log('handleApolloMutation error  :>> ', errorResponse)
    payload = errorResponse as ErrorResponse
  }

  // It's possible that we get an error payload that doesn't land in the catch block,
  // so always try to pull errors from the payload
  const maybeErrors = extractErrors(payload)

  // console.log('maybeErrors :>> ', JSON.stringify(maybeErrors, undefined, 2))

  if (maybeErrors) {
    // console.error(maybeErrors)
    if (!maybeErrors.errors) {
      return {
        errors: maybeErrors,
      }
    }
    return maybeErrors
  }

  // console.log('success')

  return payload // Success
}
