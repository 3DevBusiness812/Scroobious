import { HStack, VStack } from '@chakra-ui/react'
import { AppNavigation } from '@components'
import {
  FounderCommunityCard,
  FounderInsightsCard,
  FounderMessagesCard,
  FounderPerksCard,
} from '@components/modules/dashboard'
import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getUserFromSession } from '@src/auth/get-user'
import { getSingleQueryParam } from '@core/querystring'

export default function Insights() {
  const [loading, setLoading] = useState(true)
  
  const loaderTimeout = () => {
    setTimeout(()=> {
      setLoading(false);
    },250)
  }

  useEffect(() => {
    loaderTimeout();
  }, [])
  return (
    <AppNavigation isLoading={loading}>
      <Head>
        <title>Dashboard</title>
      </Head>
      <VStack flex={1} gridGap={4} width="100%" justifyContent="flex-start" p={8}>
        <HStack width="100%" gridGap={4} alignItems="flex-start" justifyContent="space-between">
          <FounderInsightsCard />
          <FounderCommunityCard />
        </HStack>

        <HStack width="100%" gridGap={4} alignItems="flex-start" justifyContent="space-between">
          <FounderMessagesCard />
          <FounderPerksCard />
        </HStack>
      </VStack>
    </AppNavigation>
  )
}
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await getUserFromSession(context);
  if (user?.status === "INACTIVE") {
    return {
      redirect: {
        permanent: false,
        destination: `/`
      }
    }
  }
  return {
    props: {},
  }
}
