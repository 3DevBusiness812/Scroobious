import React, { useState, useEffect } from 'react'
import { gql } from '@apollo/client'
import { Box, HStack, SimpleGrid, VStack } from '@chakra-ui/react'
import { Alert, AppNavigation, Card } from '@components'
import { ManageSubscriptionButton } from '@components/modules/auth'
import { InsightCard } from '@components/modules/insights'
import { initializeApollo } from '@core/apollo-client'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { usePermissions } from '@core/user.provider'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { FaEnvelope, FaVideo } from 'react-icons/fa'
import { processApolloError } from '../../core/apollo'

type InsightsProps = {
  stats: any
  errors: any
}

export default function Insights({ stats, errors }: InsightsProps) {
  const [{ data, loading: permissionsLoading, hasPermission }] = usePermissions()
  const [loading, setLoading] = useState(true)

  function getPageContent() {
    if (hasPermission(data.permissions, 'conversation_message:list')) {
      return (
        <HStack p={6} width="100%" justifyContent="flex-start">
          {errors && errors.length > 0 && (
            <Box>
              <Alert status="error">{errors.isArray ? errors[0].message : errors}</Alert>
            </Box>
          )}
          {!stats || (stats.length < 1 && !errors && <Box>No stats available</Box>)}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 5, lg: 8 }}>
            {stats &&
              stats.length > 0 &&
              stats.map((item: any, idx: number) => {
                return (
                  <InsightCard
                    key={idx.toString()}
                    name={item.name}
                    stat={item.stat}
                    icon={item.icon === 'video' ? FaVideo : FaEnvelope}
                    iconColor={item.color}
                  />
                )
              })}
          </SimpleGrid>
        </HStack>
      )
    }

    return (
      <Card className="w-2/3 mx-auto py-10 mt-10">
        <p className="w-3/4 mx-auto text-base text-gray-500 text-center">
          Founders who subscribe to the Medium and Full plans and have a pitch listed on our investor discovery platform
          are able to see insights about how investors are engaging with their material including unique views, total
          plays, play rate, average engagement, and messages sent.
        </p>
        <p className="w-3/4 mx-auto text-base text-gray-500 text-center mt-8">
          Upgrade your account to access this benefit!
        </p>
        <div className="text-center mt-8">
          <ManageSubscriptionButton />
        </div>
      </Card>
    )
  }

  const loaderTimeout = () => {
    setTimeout(()=> {
      setLoading(false)
    }, 250)
  }

  useEffect(() => {
    loaderTimeout()
  }, [])

  if (permissionsLoading) {
    return <div />
  }

  return (
    <AppNavigation isLoading={loading}>
      <Head>
        <title>Founder Insights</title>
      </Head>
      <VStack flex={1} width="100%" justifyContent="flex-start" px={4}>
        {getPageContent()}
      </VStack>
    </AppNavigation>
  )
}

const INSIGHTS_QUERY = gql`
  query {
    generateReport(type: "messages-sent") {
      result
    }
  }
`
const PITCH_STATS_QUERY = gql`
  query {
    pitchVideoStats {
      load_count
      play_count
      play_rate
      hours_watched
      engagement
      visitors
    }
  }
`

export type InsightsQuery = any // TODO: codegen
export type PitchVideoStats = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    const client = initializeApollo({ headers: context?.req?.headers })
    try {
      // 1. Reports
      const insightsResponse = await client.query<InsightsQuery>({
        query: INSIGHTS_QUERY,
      })
      // 2. Get pitch
      const statsResponse = await client.query<PitchVideoStats>({
        query: PITCH_STATS_QUERY,
        variables: {
          limit: 1,
        },
      })

      const wistiaStats = statsResponse.data.pitchVideoStats

      // 5. Merge Stats
      const { generateReport } = insightsResponse.data
      const stats = [
        {
          name: 'Unique Views',
          stat: wistiaStats ? wistiaStats?.visitors : 0,
          color: 'teal.500',
          icon: 'video',
        },
        {
          name: 'Total Plays',
          stat: wistiaStats ? wistiaStats?.play_count : 0,
          color: 'purple.500',
          icon: 'video',
        },
        {
          name: 'Play Rate',
          stat: wistiaStats ? `${Math.round(wistiaStats?.play_rate * 100)}%` : 0,
          color: 'red.500',
          icon: 'video',
        },
        {
          name: 'Average Engagement',
          stat: wistiaStats ? `${Math.round(wistiaStats?.engagement * 100)}%` : 0,
          color: 'pink.500',
          icon: 'video',
        },
        {
          name: 'Times Loaded',
          stat: wistiaStats ? wistiaStats?.load_count : 0,
          color: 'blue.500',
          icon: 'video',
        },
        {
          name: 'Hours Watched',
          stat: wistiaStats ? `${(wistiaStats?.hours_watched).toFixed(3)}` : 0,
          color: 'blue.500',
          icon: 'video',
        },
        {
          name: 'Messages Sent',
          stat: generateReport?.result,
          color: 'yellow.500',
          icon: 'message',
        },
      ]
      return { props: { stats, errors: null } }
    } catch (error: any) {
      const errors = processApolloError(error)
      return { props: { stats: [], errors } }
    }
  },
)
