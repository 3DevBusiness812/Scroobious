import cn from 'classnames'
import { gql } from '@apollo/client'
import { Pitch } from '@binding'
import { Box, HStack, Spacer } from '@chakra-ui/react'
import { AppNavigation, FilterColumn, MainContent, SectionHeader } from '@components'
import { PitchFilters } from '@components/modules/pitches/PitchFilters'
import { PitchSection } from '@components/modules/pitches/PitchSection'
import { initializeApollo } from '@core/apollo-client'
import { protect } from '@core/server'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { ScroobiousSession } from '@core/types'
import { useRouter } from 'next/router'
import { processApolloError } from '../../../core/apollo'

type PitchListProps = {
  recommendedPitches?: Pitch[]
  pitchUserStatuses?: any[]
  errors?: string
}

export default function PitchList({ recommendedPitches, pitchUserStatuses, errors }: PitchListProps) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loaderTimeout = () => {
    setTimeout(() => {
      setLoading(false)
    }, 250)
  }

  useEffect(() => {
    loaderTimeout()
  }, [])

  if (errors) {
    return <div>Errors: {errors}</div>
  }

  const myReactions = Object.keys(router.query).length === 1
  const allPitches = Object.keys(router.query).length === 0

  return (
    <AppNavigation isLoading={loading}>
      <Head>
        <title>Investor Pitches</title>
      </Head>
      <FilterColumn>
        <PitchFilters key={JSON.stringify(router.query)} />
      </FilterColumn>

      <MainContent className="pl-6 pt-4 space-y-4">
        <HStack>
          <SectionHeader title="Explore All Pitches" />
          <Spacer />
          <Box className="pr-20 pb-4">
            <button
              type="button"
              className={cn(allPitches ? 'font-bold' : '')}
              onClick={() => {
                router.push({
                  pathname: router.pathname,
                })
              }}
            >
              All
            </button>
            {' | '}
            <button
              type="button"
              className={cn(myReactions && router.query.listStatus_eq === 'BOOKMARK' ? 'font-bold' : '')}
              onClick={() => {
                router.push({
                  pathname: router.pathname,
                  query: 'listStatus_eq=BOOKMARK',
                })
              }}
            >
              Bookmarked
            </button>
            {' | '}
            <button
              type="button"
              className={cn(myReactions && router.query.listStatus_eq === 'IGNORE' ? 'font-bold' : '')}
              onClick={() => {
                router.push({
                  pathname: router.pathname,
                  query: 'listStatus_eq=IGNORE',
                })
              }}
            >
              Passed
            </button>
          </Box>
        </HStack>
        <div className="flex flex-wrap overflow-x-auto pb-6">
          <PitchSection
            cardWidth={280}
            investorCardLayout="vertical"
            pitches={recommendedPitches}
            pitchUserStatuses={pitchUserStatuses}
          />
        </div>
      </MainContent>
    </AppNavigation>
  )
}

const PITCH_LIST_QUERY = gql`
  fragment PitchListFields on Pitch {
    id
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
        tinyDescription
        # image
      }
    }
  }

  query PitchListQuery($where: PitchQueryInput, $limit: Int) {
    recommendedPitches: pitches(where: $where, limit: $limit, orderBy: createdAt_DESC) {
      ...PitchListFields
    }
  }
`

const FIND_INVESTOR_QUERY = gql`
  query user($where: UserWhereUniqueInput!) {
    user(where: $where) {
      investorProfile {
        userId
        industries
        stateProvince
        companyStages
        fundingStatuses
        revenues
      }
    }
  }
`

const PITCH_USER_STATUS_QUERY = gql`
  query PitchUserStatusesQuery($where: PitchUserStatusWhereInput!) {
    pitchUserStatuses(where: $where) {
      userId
      pitchId
      listStatus
      watchStatus
    }
  }
`

export type PitchListQuery = any // TODO: codegen
export type InvestorProfileQuery = any // TODO: codegen
export type PitchUserStatusQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    const client = initializeApollo({ headers: context?.req?.headers })
    // console.log(`context.query`, context.query)

    const investorPayload = await client.query<InvestorProfileQuery>({
      query: FIND_INVESTOR_QUERY,
      variables: {
        where: {
          id: session.user.id,
        },
      },
    })

    const investorProfile = investorPayload.data.user?.investorProfile || {}

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

    const RANKING_WEIGHT = {
      bookmarks: 10,
      views: 1,
      companyStage: 10,
      revenue: 9,
      fundraiseStatus: 8,
      industries: 7,
      stateProvince: 6,
    }

    try {
      const payload = await client.query<PitchListQuery>({
        query: PITCH_LIST_QUERY,
        variables: {
          limit: 100,
          where,
        },
      })

      const calculateRecommendedPitchRank = (pitch: Pitch) =>
        ((investorProfile.companyStages || []).includes(pitch.organization.startup.companyStage)
          ? RANKING_WEIGHT.companyStage
          : 0) +
        ((investorProfile.revenues || []).includes(pitch.organization.startup.revenue) ? RANKING_WEIGHT.revenue : 0) +
        ((investorProfile.fundingStatuses || []).includes(pitch.organization.startup.fundraiseStatus)
          ? RANKING_WEIGHT.fundraiseStatus
          : 0) +
        ((investorProfile.industries || []).includes(pitch.organization.startup.industries)
          ? RANKING_WEIGHT.industries
          : 0) +
        (investorProfile.stateProvince === pitch.organization.startup.stateProvince ? RANKING_WEIGHT.stateProvince : 0)

      const pitchUserStatusPayload = await client.query<PitchUserStatusQuery>({
        query: PITCH_USER_STATUS_QUERY,
        variables: {
          where: {
            userId_eq: session.user.id,
          },
        },
      })

      const result = {
        props: {
          ...payload.data,
          recommendedPitches: [...payload.data.recommendedPitches].sort(
            (pitchA: Pitch, pitchB: Pitch) =>
              calculateRecommendedPitchRank(pitchB) - calculateRecommendedPitchRank(pitchA),
          ),
          pitchUserStatuses: (pitchUserStatusPayload.data.pitchUserStatuses || []).reduce(
            (a: any, u: any) => ({ ...a, [u.pitchId]: u.listStatus }),
            {},
          ),
        },
      }

      // addApolloState(client, result)
      return result
    } catch (error) {
      // console.log('ERROR ON PITCH INDEX PAGE')
      const errors = processApolloError(error)
      return { props: { errors: JSON.stringify(errors) } }
    }
  },
)
