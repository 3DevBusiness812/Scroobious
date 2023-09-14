import { UserUpdateInput, UserWhereUniqueInput } from '@binding'
import { callAPI } from '@core/request'

export async function updateUser(data: UserUpdateInput, where: UserWhereUniqueInput) {
  return callAPI<any>({
    variables: { data, where },
    query: `
      mutation ($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
        updateUser(data: $data, where: $where) {
          id
          name
          email
          profilePictureFile {
            id
            url
          }    
          createdAt
        }
      }
    `,
    operationName: 'updateUser',
  })
}
