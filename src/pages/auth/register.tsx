import { Box, Center, Link, Text, VStack } from '@chakra-ui/react'
import { Alert, Header, Logo } from '@components'
import { FormRegister } from '@components/modules/auth'
import { getSingleQueryParam } from '@core/querystring'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { TemplateSplashContent } from '../../templates/TemplateSplashContent'

interface RegisterPageProps {
  csrfToken: string
  v2BaseUrl: string
}

export default function RegisterPage({ csrfToken, v2BaseUrl }: RegisterPageProps) {
  const router = useRouter()
  // console.log('router.query.type :>> ', router.query.type)

  const registrationType = String(router.query.type).toUpperCase()
  const title = {
    FOUNDER_FULL: 'Register to create your pitch',
    FOUNDER_MEDIUM: 'Register to create your pitch',
    FOUNDER_LITE: 'Register to join the Scroobious community',
    INVESTOR: 'Register to start watching pitches',
    REVIEWER: 'Register to start reviewing pitches',
  }[registrationType]

  return (
    <TemplateSplashContent>
      <Center h="100%">
        <VStack spacing={6} mr="5%" ml="5%" h="100%" flex={1}>
          <Box pt="6">
            <Logo />
          </Box>
          {(router.query.email || router.query.name) && (
            <Alert status="success">
              <p>Payment received successfully, Please continue registration.</p>
            </Alert>
          )}
          <Header title={title || ''} />
          <Box w="70%">
            <FormRegister
              registrationType={registrationType}
              v2ReviewerRedirectUrl={`${v2BaseUrl}/auth/login`}
              csrfToken={csrfToken}
            />
          </Box>
          <Text fontSize="sm">
            <span className="mr-2">Already have an account?</span>
            <Link href="../login" fontSize="sm" textColor="blue.500">
              Sign In
            </Link>
          </Text>
        </VStack>
      </Center>
    </TemplateSplashContent>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const userType = getSingleQueryParam(context.query, 'type')

  if (userType !== 'reviewer') {
    // console.log('direct registration not available in Production')
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      v2BaseUrl: process.env.V2_BASE_URL,
    },
  }
}
