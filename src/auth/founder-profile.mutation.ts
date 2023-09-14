import { FounderProfileUpdateInput, FounderProfileWhereUniqueInput } from '@binding'
import { callAPI } from '@core/request'

export async function updateFounderProfile(data: FounderProfileUpdateInput, where: FounderProfileWhereUniqueInput) {
  return callAPI<any>({
    variables: { data, where },
    query: `
      mutation ($data: FounderProfileUpdateInput!, $where: FounderProfileWhereUniqueInput!) {
        updateFounderProfile(data: $data, where: $where) {
          id
          stateProvince
          twitterUrl
          linkedinUrl
          ethnicities
          gender
          sexualOrientation
          transgender
          disability
          companyRoles
          workingStatus
          pronouns
          source
          bubbleLocation
          industry
          presentationStatus
          fundingStatus
          companyStage
        }
      }
    `,
    operationName: 'updateFounderProfile',
  })
}
