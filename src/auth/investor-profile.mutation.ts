import { InvestorProfileCreateInput, InvestorProfileUpdateInput, InvestorProfileWhereUniqueInput } from '@binding'
import { callAPI } from '@core/request'

export async function createInvestorProfile(data: InvestorProfileCreateInput) {
  return callAPI<any>({
    variables: { data },
    query: `
      mutation ($data: InvestorProfileCreateInput!) {
        createInvestorProfile(data: $data) {
          id
          accreditationStatuses
          linkedinUrl
          investorTypes
          createdAt
        }
      }
    `,
    operationName: 'createInvestorProfile',
  })
}

export async function updateInvestorProfile(data: InvestorProfileUpdateInput, where: InvestorProfileWhereUniqueInput) {
  return callAPI<any>({
    variables: { data, where },
    query: `
      mutation ($data: InvestorProfileUpdateInput!, $where: InvestorProfileWhereUniqueInput!) {
        updateInvestorProfile(data: $data, where: $where) {
          id
          accreditationStatuses
          linkedinUrl
          investorTypes
          createdAt
          companyStages
          criteria
          ethnicities
          gender
          industries
          pronouns
          source
          thesis
        }
      }
    `,
    operationName: 'updateInvestorProfile',
  })
}
