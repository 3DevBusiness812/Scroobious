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
        <title>Founder Register</title>
      </Head>
      <Center h="100%">
        <VStack mr="5%" ml="5%" h="100%" flex={1}>
          <Box pt="6">
            <Logo />
          </Box>
          {(router.query.email || router.query.name) && (
            <Alert status="success">
              <p>Payment received successfully, Please continue registration.</p>
            </Alert>
          )}
          <Header title="Register to create your pitch" />
          <Box w="70%">
            {/* TODO: this user type needs to be dynamic from Stripe */}
            <FormRegister registrationType="FOUNDER_FULL" csrfToken={csrfToken} />
          </Box>
          <Text py={6}>
            <span className="mr-2">Already have an account?</span>
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
