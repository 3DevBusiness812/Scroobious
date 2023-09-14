import { Box, Center, Link, Text, VStack } from '@chakra-ui/react'
import { Alert, Header, Logo } from '@components'
import { FormRegister } from '@components/modules/auth'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { TemplateSplashContent } from '../../templates/TemplateSplashContent'

interface RegisterPageProps {
  csrfToken: string
}

export default function RegisterPage({ csrfToken }: RegisterPageProps) {
  const router = useRouter()

  return (
    <TemplateSplashContent>
      <Head>
        <title>Investor Register</title>
      </Head>
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
          <Header title="Register to start watching pitches" />
          <FormRegister registrationType="INVESTOR" csrfToken={csrfToken} />
          <Text pb={6}>
            Already have an account?
            <Link href="/auth/login" textColor="blue.500">
              {' '}
              Sign In
            </Link>
          </Text>
        </VStack>
      </Center>
    </TemplateSplashContent>
  )
}
