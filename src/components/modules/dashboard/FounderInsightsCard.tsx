import { gql, useQuery } from '@apollo/client'
import { Box, SimpleGrid } from '@chakra-ui/react'
import { InsightCard } from '@components/modules/insights'
import { EmptyStateText } from '@components/typography'
import React from 'react'
import { FaVideo } from 'react-icons/fa'
import { FounderDashboardCard } from './FounderDashboardCard'

const QUERY = gql`
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

const CardContent = () => {
  const hasAccess = true

  const { loading, error, data } = useQuery<{ pitchVideoStats: any }>(QUERY)

  // console.log('data :>> ', data)

  const InsightData = [
    { name: 'Unique Views', stat: data ? data?.pitchVideoStats?.visitors : 0, color: 'teal.500' },
    { name: 'Total Plays', stat: data ? data?.pitchVideoStats?.play_count : 0, color: 'purple.500' },
  ]

  if (!hasAccess) {
    return (
      <EmptyStateText
        className="px-8"
        title="Members on the Full plan are able to upload final pitch material, request to be listed in the investor-facing platform, and view data about how investors are engaging with their pitch. Please upgrade your account to access these benefits."
      />
    )
  }

  if (!InsightData.length) {
    return <EmptyStateText className="w-full text-center" title="No Data Available" />
  }

  return (
    <SimpleGrid ml={4} mt={4} columns={{ base: 2, md: 2 }} spacing={{ base: 2, lg: 4 }}>
      {InsightData.map((item) => {
        return (
          <Box key={item.name}>
            <InsightCard
              name={item.name}
              stat={item.stat}
              icon={FaVideo}
              iconColor={item.color}
              className="border-solid border-2 border-gray-300 "
            />
          </Box>
        )
      })}
    </SimpleGrid>
  )
}

export function FounderInsightsCard() {
  return (
    <FounderDashboardCard
      title="While You Were Gone"
      buttonLabel="View All Insights"
      buttonHref="/founder/insights"
      minHeight={200}
    >
      <CardContent />
    </FounderDashboardCard>
  )
}
