import { Box, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react'
import { Header } from '@components/Header'
import { OnboardingFounderProfileForm, OnboardingFounderStartupForm } from '@components/modules/onboarding'
import { getSingleQueryParam } from '@core/querystring'
import { protect } from '@core/server'
import { getUserFromSession } from '@src/auth/get-user'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

export default function OnboardingPage() {
  const router = useRouter()
  // console.log('router.query.step :>> ', router.query.step)

  const navigateToNextStep = async (data: any) => {
    // console.log('data :>> ', data)

    const updatedQueryString = { ...router.query }
    const nextStep = {
      founder: 'startup',
      startup: 'DONE',
    }[getSingleQueryParam(router.query, 'step') || 'founder']
    updatedQueryString.step = nextStep

    // console.log('updatedQueryString :>> ', updatedQueryString)

    if (nextStep === 'DONE') {
      return router.push({
        // Push user to `/` route, which is the main router to bring a user where they're supposed to be
        pathname: '/',
      })
    }
    if (nextStep === 'startup') {
      router.push({
        pathname: router.pathname,
        query: updatedQueryString,
      })
    }
  }

  return (
    <>
      <Head>
        <title>Founder Onboarding</title>
      </Head>
      <VStack flex={1} width="100%" justifyContent="flex-start" px={4}>
        <HStack flexGrow={1} justifyContent="center" alignItems="center" width="100%">
          <Box width="80%" p={6}>
            <Tabs isManual size="md" variant="enclosed" index={router.query.step === 'startup' ? 1 : 0}>
              <TabList borderBottomWidth={4} borderBottomColor="green.300">
                <Tab
                  _selected={{ color: 'white', bg: 'green.300' }}
                  fontWeight="bold"
                  isDisabled={router.query.step !== 'founder'}
                >
                  Profile
                </Tab>
                <Tab
                  _selected={{ color: 'white', bg: 'green.300' }}
                  fontWeight="bold"
                  isDisabled={router.query.step !== 'startup'}
                >
                  Company
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box w="100%" my="4">
                    <Header title="Tell us about yourself" />
                  </Box>
                  <OnboardingFounderProfileForm onSave={navigateToNextStep} />
                </TabPanel>
                <TabPanel>
                  <Box w="100%" my="4">
                    <Header title="Tell us about your startup" />
                  </Box>
                  <OnboardingFounderStartupForm onSave={navigateToNextStep} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </HStack>
      </VStack>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = protect<any>(async (context: GetServerSidePropsContext) => {
  const step = getSingleQueryParam(context.query, 'step')
  const user = await getUserFromSession(context)
  const props = {}
  if (!user) {
    return { props }
  }
  if (user.status === "INACTIVE") {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/subscription',
      },
    }
  }

  // Redirect to the startup tab if needed
  if (user.status === 'ONBOARDING_STARTUP' && step !== 'startup') {
    return {
      redirect: {
        permanent: false,
        destination: '/founder/onboarding?step=startup',
      },
    }
  }

  // console.log(`props`, props)

  return { props }
})
