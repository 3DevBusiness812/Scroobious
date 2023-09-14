import React, { useState, useEffect } from 'react'
import { gql } from '@apollo/client'
import { Pitch } from '@binding'
import { AppNavigation, FilterColumn, MainContent } from '@components'
import { AdminPitchTable, PitchFilters } from '@components/modules/pitches'
import { initializeApollo } from '@core/apollo-client'
import { protect } from '@core/server'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { processApolloError } from '../../../core/apollo'

type PitchListProps = {
  pitches?: Pitch[]
  errors?: string
}

export default function PitchList({ pitches, errors }: PitchListProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (errors) {
    return <div>Errors: {errors}</div>
  }

  if (!pitches) {
    return <div>empty payload: {pitches}</div>
  }

  return (
    <AppNavigation isLoading={isLoading}>
      <FilterColumn>
        <PitchFilters />
      </FilterColumn>

      <MainContent className="w-full ml-4 mt-4">
        <AdminPitchTable pitches={pitches} />
      </MainContent>
    </AppNavigation>
  )
}

const PITCH_LIST_QUERY = gql`
  query PitchListQuery($where: PitchQueryInput, $limit: Int) {
    pitches(where: $where, limit: $limit, orderBy: createdAt_DESC) {
      id
      status
      views
      bookmarks
      listStatus
      createdAt
      activePitchDeck {
        file {
          url
        }
      }
      activePitchVideo {
        video {
          wistiaUrl
          file {
            url
          }
        }
      }
      organization {
        startup {
          industries
          fundraiseStatus
          stateProvince
          companyStage
          revenue
          name
          shortDescription
          # image
        }
      }
    }
  }
`
export type PitchUserStatusQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect(async (context: GetServerSidePropsContext) => {
  const client = initializeApollo({ headers: context?.req?.headers })
  // console.log(`context.query`, context.query)

  // Build where filter from query string.  Use white list and remove items that are empty
  const where = { ...context.query }
  Object.keys(where).forEach((key: string) => {
    if (
      [
        'industry_eq',
        'fundingStatus_eq',
        'stateProvince_eq',
        'companyStage_eq',
        'revenue_eq',
        'listStatus_eq',
        'femaleLeader_eq',
        'minorityLeader_eq',
      ].indexOf(key) < 0 ||
      !where[key]
    ) {
      delete where[key]
    }
  })

  // console.log(`where`, where)

  try {
    const payload = await client.query<PitchUserStatusQuery>({
      query: PITCH_LIST_QUERY,
      variables: {
        limit: 20,
        where,
      },
    })

    // console.log('payload :>> ', JSON.stringify(payload, undefined, 2))

    const result = {
      props: payload.data,
    }
    // addApolloState(client, result)
    return result
  } catch (error: any) {
    // console.log('ERROR ON PITCH INDEX PAGE')
    const errors = processApolloError(error)
    return { props: { errors: JSON.stringify(errors) } }
  }
})
