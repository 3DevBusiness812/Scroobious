import { gql } from '@apollo/client'
import { HStack, SimpleGrid, VStack } from '@chakra-ui/react'
import { AppNavigation } from '@components'
import { InsightCard } from '@components/modules/insights'
import { initializeApollo } from '@core/apollo-client'
import { protect } from '@core/server'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { FaUserAlt } from 'react-icons/fa'
import { processApolloError } from '../../core/apollo'

type InsightsProps = {
  generateReport: any
}

export default function Insights({ generateReport }: InsightsProps) {
  const [loading, setLoading] = useState(true)
  if (!generateReport) {
    return <div>empty payload: {generateReport}</div>
  }

  const stats = [
    { name: 'Messages Sent', stat: generateReport.result, color: 'yellow.500' },
    { name: 'Messages View', stat: generateReport.result, color: 'blue.500' },
    { name: 'Deck Viewed', stat: generateReport.result, color: 'orange.500' },
    { name: 'Video watched', stat: generateReport.result, color: 'teal.500' },
  ]
  const loaderTimeout = () => {
    setTimeout(() => {
      setLoading(false);
    }, 250)
  }
  useEffect(() => {
    loaderTimeout()
  }, [])
  return (
    <AppNavigation isLoading={loading} >
      <Head>
        <title>Investor Insights</title>
      </Head>
      <VStack flex={1} width="100%" justifyContent="flex-start" px={4}>
        {/* <HStack className="mx-4 py-4" pl={4} width="100%" justifyContent="flex-start">
          <Breadcrumb flexGrow={1} spacing="8px" separator={<BsChevronRight color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/investor/pitches">
                <BiHome />
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink href="#">Insights</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </HStack> */}
        <HStack p={6} width="100%" justifyContent="flex-start">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 5, lg: 8 }}>
            {stats.map((item, idx) => {
              return (
                <InsightCard
                  key={item.name}
                  name={item.name}
                  stat={item.stat}
                  icon={FaUserAlt}
                  iconColor={item.color}
                />
              )
            })}
          </SimpleGrid>
        </HStack>
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
export type InsightsQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect(async (context: GetServerSidePropsContext) => {
  const client = initializeApollo({ headers: context?.req?.headers })

  try {
    const payload = await client.query<InsightsQuery>({
      query: INSIGHTS_QUERY,
    })

    const result = {
      props: payload.data,
    }
    // addApolloState(client, result)
    return result
  } catch (error) {
    // console.log('ERROR ON INSIGHTS INDEX PAGE')
    const errors = processApolloError(error)
    return { props: { errors: JSON.stringify(errors) } }
  }
})
