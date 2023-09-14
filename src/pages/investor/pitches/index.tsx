import { gql } from '@apollo/client'
import { Pitch } from '@binding'
import { HStack, Heading } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { AppNavigation, MainContent, SectionHeader, LinkButton } from '@components'
import { PitchSection } from '@components/modules/pitches/PitchSection'
import { useSession } from 'next-auth/client'
import { initializeApollo } from '@core/apollo-client'
import { protect } from '@core/server'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { ScroobiousSession } from '@core/types'
import { processApolloError } from '../../../core/apollo'

type PitchListProps = {
  recommendedPitches?: Pitch[]
  newPitches?: Pitch[]
  popularPitches?: Pitch[]
  pitchUserStatuses?: any[]
  errors?: string
}

export default function PitchList({
  recommendedPitches,
  newPitches,
  popularPitches,
  pitchUserStatuses,
  errors,
}: PitchListProps) {
  const [loading, setLoading] = useState(true)

  if (errors) {
    return <div>Errors: {errors}</div>
  }

  const [session] = useSession()

  // console.log('lists :>> ', lists)

  if (!newPitches) {
    return <div>empty payload: {newPitches}</div>
  }

  const loaderTimeout = () => {
    setTimeout(() => {
      setLoading(false)
    }, 250)
  }
  useEffect(() => {
    loaderTimeout()
  }, [])

  return (
    <AppNavigation isLoading={loading}>
      <Head>
        <title>Investor Pitches</title>
      </Head>

      <MainContent className="pl-6 pt-4 space-y-4">
        {/* <Card className="shadow-sm my-10">  */}
        <Heading className="pt-10">Welcome, {session?.user.name}!</Heading>
        <p className="pb-10">
          Explore pitches from hundreds of diverse founders. Our AI based recommendation engine is currently training,
          so the more you interact with founders the better it will get. Leave feedback, bookmark pitches that you like
          and send messages to founders to improve the results.{' '}
        </p>
        {/* </Card> */}
        <SectionHeader title="Recommended for You" />
        <div className="flex flex-wrap overflow-x-auto pb-6">
          <PitchSection cardWidth={280} investorCardLayout="vertical" pitches={recommendedPitches} pitchUserStatuses={pitchUserStatuses} />
          <HStack alignContent="center" justifyContent="center">
            <LinkButton
              href="/investor/pitches/recommended"
              buttonProps={{
                mt: '4',
                ml: '2',
                variant: 'outline',
                bgColor: 'white',
                textColor: 'primary.400',
                leftIcon: <AddIcon textColor="black" className="w-6" />,
              }}
            >
              More
            </LinkButton>
          </HStack>
        </div>

        <SectionHeader title="Recently Added" />
        <div className="flex flex-wrap w-full overflow-x-auto pb-6">
          <PitchSection
            cardWidth={280}
            investorCardLayout="vertical"
            pitches={newPitches}
            pitchUserStatuses={pitchUserStatuses}
          />
          <HStack alignContent="center" justifyContent="center">
            <LinkButton
              href="/investor/pitches/recommended"
              buttonProps={{
                mt: '4',
                ml: '2',
                variant: 'outline',
                bgColor: 'white',
                textColor: 'primary.400',
                leftIcon: <AddIcon textColor="black" className="w-6" />,
              }}
            >
              More
            </LinkButton>
          </HStack>
        </div>

        <SectionHeader title="Popular Pitches" />
        <div className="flex flex-wrap w-full overflow-x-auto pb-6">
          <PitchSection cardWidth={280} investorCardLayout="vertical" pitches={popularPitches} pitchUserStatuses={pitchUserStatuses} />
          <HStack alignContent="center" justifyContent="center">
            <LinkButton
              href="/investor/pitches/recommended"
              buttonProps={{
                mt: '4',
                ml: '2',
                variant: 'outline',
                bgColor: 'white',
                textColor: 'primary.400',
                leftIcon: <AddIcon textColor="black" className="w-6" />,
              }}
            >
              More
            </LinkButton>
          </HStack>
        </div>

        {/* <HStack py={4} w="100%" flex={1} justifyContent="flex-start" alignItems="flex-start">
          <VStack w="60%" alignItems="flex-start">
            
          </VStack>

          <VStack w="40%" height="100%" alignItems="flex-start">
            
          </VStack>
        </HStack> */}
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
    recommendedPitches: pitches(where: $where, limit: $limit, orderBy: updatedAt_DESC) {
      ...PitchListFields
    }
    newPitches: pitches(where: $where, limit: $limit, orderBy: updatedAt_DESC) {
      ...PitchListFields
    }
    popularPitches: pitches(where: $where, limit: $limit, orderBy: views_DESC) {
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
          limit: 7,
          where,
        },
      })

      const calculatePopularPitchRank = (pitch: Pitch) =>
        pitch.bookmarks * RANKING_WEIGHT.bookmarks + pitch.views * RANKING_WEIGHT.views

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
          popularPitches: [...payload.data.popularPitches].sort(
            (pitchA: Pitch, pitchB: Pitch) => calculatePopularPitchRank(pitchB) - calculatePopularPitchRank(pitchA),
          ),
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
