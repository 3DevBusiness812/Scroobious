import { UserRegisterInput } from '@binding'
import { callAPI } from '@core/request'

export async function registerUser(data: UserRegisterInput) {
  return callAPI<any>({
    variables: { data },
    query: `
      mutation ($data: UserRegisterInput!) {
        register(data: $data) {
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
    operationName: 'register',
  })
}
