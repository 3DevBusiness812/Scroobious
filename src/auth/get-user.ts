import { User } from '@binding'
import { decodeToken } from '@core/jwt'
import { callAPI } from '@core/request'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/client'

export async function getUserFromSession(context: GetServerSidePropsContext): Promise<User | undefined> {
  const session = await getSession(context)
  if (!session) {
    return undefined
  }
  const decoded = decodeToken((session as any).apiToken)
  if (!decoded) {
    return undefined
  }
  const { id } = decoded

  return callAPI<any>({
    variables: {
      where: { id },
    },
    query: `
        query UserQuery($where: UserWhereUniqueInput!) {
            user(where: $where) {
                id
                status
                capabilities
                email
            }
        }
    `,
    operationName: 'user',
  })
}
