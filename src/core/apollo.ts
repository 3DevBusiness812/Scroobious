import { ApolloError } from '@apollo/client'
import { initializeApollo } from '@core/apollo-client'
import { GetServerSidePropsContext } from 'next'

const get = require('lodash.get')

export function processApolloError(error: ApolloError | Error) {
  // console.log(error)
  // console.log('keys', Object.keys(error))

  if (error instanceof ApolloError) {
    if (error.graphQLErrors) {
      // console.log(
      //   'graphQLErrors[0].extensions.exception.validationErrors :>> ',
      //   get(error, 'graphQLErrors[0].extensions.exception.validationErrors'),
      // )

      const validationErrors = get(error, 'graphQLErrors[0].extensions.exception.validationErrors')
      // console.log('validationErrors :>> ', validationErrors)

      if (validationErrors) {
        return validationErrors
      }

      return error.graphQLErrors
    }

    const nestedNetworkErrors = get(error, 'networkError.result.errors')
    if (nestedNetworkErrors) {
      return nestedNetworkErrors
    }

    return error.clientErrors || error.networkError || error.message
  }

  return error.message
}

export function initServerSideClient(context: GetServerSidePropsContext) {
  if (!context || !context.req || !context.req.headers) {
    // console.log(context)
    throw new Error('initServerSideClient: could not find headers from request')
  }

  return initializeApollo({ headers: context.req.headers })
}
