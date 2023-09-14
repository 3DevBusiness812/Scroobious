import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getSession } from 'next-auth/client'
import { ParsedUrlQuery } from 'querystring'
import { processApolloError } from './apollo'
import { ScroobiousSession } from './types'

// Provide the ability to wrap all of our GetServerSideProps functions to automatically protect endpoints
type ProtectResult<P, Q extends ParsedUrlQuery = ParsedUrlQuery> = (
  context: GetServerSidePropsContext<Q>,
) => Promise<GetServerSidePropsResult<P>>

export function protect<P extends { [key: string]: any }, Q extends ParsedUrlQuery = ParsedUrlQuery>(
  fn: (_: GetServerSidePropsContext<Q>, session: ScroobiousSession) => Promise<GetServerSidePropsResult<P>>,
): ProtectResult<P, Q> {
  return async (context: GetServerSidePropsContext<Q>) => {
    try {
      // console.log('Start protect')
      const session = (await getSession({ req: context.req })) as ScroobiousSession
      if (!session) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }

      // console.log('Start to run page getServerSideProps')
      const result = await fn(context, session)
      // console.log('Finish running getServerSideProps')
      // console.log('result', JSON.stringify(result, null, 2))

      return result
    } catch (error) {
      console.error(error)
      const errors = processApolloError(error)

      return {
        props: {
          errors: {
            code: '500', // TODO: figure out how to have the resulting page handle unknown errors
          },
        },
      } as any // TODO: fix this
    }
  }
}
