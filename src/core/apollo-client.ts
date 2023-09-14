// TODO: need to catch issues like invalid users and bad JWTs and log the person out and redirect to login page
// TODO: more involved example: https://github.com/vercel/next.js/tree/canary/examples/with-typescript-graphql
// Good example: https://github.com/sophiabrandt/nextjs-ecommerce/tree/main/frontend
//  - https://www.rockyourcode.com/nextjs-with-apollo-ssr-cookies-and-typescript/
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { onError } from '@apollo/link-error'
import merge from 'deepmerge'
import { IncomingHttpHeaders } from 'http'
import fetch from 'isomorphic-unfetch'
import isEqual from 'lodash/isEqual'
import type { AppProps } from 'next/app'
// import { paginationField } from './paginationField'
import { useMemo } from 'react'

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

// Advanced cookie usage
// https://github.com/borisowsky/next-advanced-apollo-starter/blob/master/src/lib/apollo/apollo.tsx#L17
const createApolloClient = (headers: IncomingHttpHeaders | null = null) => {
  // console.log(`Creating apollo client: ${JSON.stringify(headers)}`)
  // DEBUG_AUTH: console.log('createApolloClient headers', headers)

  // If the apollo client is created with a hard-coded auth token, use it (used with next-auth adapter M2M calls)
  const authHeaderOption: any =
    headers && headers.authorization ? { authorization: `Bearer ${headers.authorization}` } : {}

  const enhancedFetch = (url: RequestInfo, init: RequestInit) => {
    // console.log(`enhancedFetch`)
    // console.log(url)
    // console.log(init)

    return (
      fetch(url, {
        ...init,
        headers: {
          ...init.headers,
          'Access-Control-Allow-Origin': '*',
          Cookie: headers?.cookie ?? '',
          ...authHeaderOption,
        },
      })
        // Unwind the promise from fetch
        .then((response) => response)
    )
  }
  // DEBUG_AUTH: console.log(`headers`, headers)

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError, response, operation, forward }) => {
        // console.log(`response`, response)
        // console.log(`operation`, operation)
        // console.log(`forward`, forward)

        if (graphQLErrors) {
          if (Array.isArray(graphQLErrors)) {
            graphQLErrors.forEach(({ message, locations, path }) =>
              console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
            )
          } else {
            // console.log('graphQLErrors :>> ', JSON.stringify(graphQLErrors, undefined, 2))
          }
        }
        if (networkError) {
          console.error(`[Network error]: ${networkError}. Backend is unreachable. Is it running?`)
        }
      }),
      // this uses apollo-link-http under the hood, so all the options here come from that package
      // createUploadLink({
      //   uri: process.env.NEXT_PUBLIC_APP_BASE_URL,
      //   fetchOptions: {
      //     mode: 'cors',
      //   },
      //   credentials: 'include',
      //   fetch: enhancedFetch,
      // }) as unknown as ApolloLink,

      // TODO: Security: Add CORS

      new HttpLink({
        uri: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/graphql`,
        credentials: 'include',
        fetch: enhancedFetch,
      }),
    ]),
    cache: new InMemoryCache({
      possibleTypes: {
        authenticatedItem: ['User'],
      },
      typePolicies: {
        Query: {
          fields: {
            // allProducts: paginationField(),
          },
        },
      },
    }),
  })
}

type InitialState = NormalizedCacheObject | undefined

interface IInitializeApollo {
  headers?: IncomingHttpHeaders | null
  initialState?: InitialState | null
}

export const initializeApollo = (
  { headers, initialState }: IInitializeApollo = { headers: null, initialState: null },
) => {
  const _apolloClient = apolloClient ?? createApolloClient(headers)

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s))),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

// export const addApolloState = (client: ApolloClient<NormalizedCacheObject>, pageProps: AppProps['pageProps']) => {
//   if (pageProps?.props) {
//     pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
//   }

//   return pageProps
// }

export function useApollo(pageProps: AppProps['pageProps']) {
  const state = pageProps[APOLLO_STATE_PROP_NAME] as NormalizedCacheObject
  const store = useMemo(() => initializeApollo({ initialState: state }), [state])
  return store
}
