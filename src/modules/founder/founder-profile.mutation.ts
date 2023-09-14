// TODO: anti-pattern, should be using useMutation hook
import { FounderProfileCreateInput, FounderProfileUpdateInput, FounderProfileWhereUniqueInput } from '@binding'
import { callAPI } from '@core/request'

export async function createFounderProfile(data: FounderProfileCreateInput) {
  return callAPI<any>({
    variables: { data },
    query: `
      mutation ($data: FounderProfileCreateInput!) {
        createFounderProfile(data: $data) {
          id
          stateProvince
          twitterUrl
          linkedinUrl
          ethnicities
          gender
          sexualOrientation
          transgender
          createdAt
        }
      }
    `,
    operationName: 'createFounderProfile',
  })
}

export async function updateFounderProfile(data: FounderProfileUpdateInput, where: FounderProfileWhereUniqueInput) {
  return callAPI<any>({
    variables: { data, where },
    query: `
      mutation ($data: FounderProfileUpdateInput!, $where: FounderProfileWhereUniqueInput!) {
        updateFounderProfile(data: $data, where: $where) {
          id
          name
          stateProvince
          twitterUrl
          linkedinUrl
          ethnicities
          gender
          sexualOrientation
          transgender
          createdAt
          createdAt
        }
      }
    `,
    operationName: 'updateFounderProfile',
  })
}
