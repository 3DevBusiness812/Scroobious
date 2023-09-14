import { UserWhereUniqueInput } from '@binding'
import { callAPI } from '@core/request'

export async function findUser(where: UserWhereUniqueInput) {
  return callAPI<any>({
    variables: { where },
    query: `
      query($where: UserWhereUniqueInput!) {
        user(where: $where) {
          id
          name
          email
          profilePictureFile {
            id
            url
          }
          status
          capabilities
          createdAt
        }
      }
    `,
    operationName: 'user',
  })
}
