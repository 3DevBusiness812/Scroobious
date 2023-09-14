import { Box, Center, Link, Text, VStack } from '@chakra-ui/react'
import { Alert, Header, Logo } from '@components'
import { FormRegister } from '@components/modules/auth'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { TemplateSplashContent } from '../templates/TemplateSplashContent'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getUserFromSession } from '@src/auth/get-user'
import { User } from '@binding'
import { getSingleQueryParam } from '@core/querystring'
import { getFromStorage, setStorage } from '@core/local'

interface RegisterPageProps {
  csrfToken: string
  user: User
}

export default function RegisterPage({ csrfToken, user }: RegisterPageProps) {
  const router = useRouter();
  const plan = router?.query?.plan || "FOUNDER_FULL"
  const checkoutUrl = router?.query?.checkout

  useEffect(() => {
    window.localStorage.setItem("plan", JSON.stringify(plan));
    window.localStorage.setItem("checkout", JSON.stringify(checkoutUrl));
  }, [])
  return (
    <TemplateSplashContent>
      <Head>
        <title>Create Account</title>
      </Head>
      <Center h="100%">
        <VStack mr="5%" ml="5%" h="100%" flex={1}>
          <Box pt="6">
            <Logo />
          </Box>
          <Header title="Create your account below" />
          <Box w="70%">
            {/* TODO: this user type needs to be dynamic from Stripe */}
            <FormRegister registrationType={plan} csrfToken={csrfToken} />
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
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await getUserFromSession(context);
  const registered = getSingleQueryParam(context.query, 'action')
  const plan = getSingleQueryParam(context.query, 'plan')
  const email = getSingleQueryParam(context.query, 'email')
  const checkoutUrl = getSingleQueryParam(context.query, 'checkout');
  const subscribed = getSingleQueryParam(context.query, 'subscribe');

  if (registered === 'completed') {
    return {
      redirect: {
        permanent: false,
        destination: `${checkoutUrl}?prefilled_email=${user?.email}&client_reference_id=${user?.id}`
      }
    }

  }

  // For users who are registered and elected to see more options on the subscription page
  if (user?.status === "INACTIVE" && checkoutUrl != undefined) {
    return {
      redirect: {
        permanent: false,
        destination: `${checkoutUrl}?prefilled_email=${user?.email}&client_reference_id=${user?.id}`
      }
    }
  }
 
  if (user) {
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
