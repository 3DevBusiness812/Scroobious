import { Box, Center, VStack } from '@chakra-ui/react'
import { Alert, ButtonSubmit, Header, InputEmail, InputPassword, Link, Logo } from '@components'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getCsrfToken, signIn } from 'next-auth/client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form'
import { TemplateSplashContent } from '../../templates/TemplateSplashContent'
import { getUserFromSession } from '@src/auth/get-user'


interface LoginPageProps {
  csrfToken: string
}

export default function LoginPage({ csrfToken }: LoginPageProps) {
  const {
    register,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
    handleSubmit,
  } = useForm()
  const router = useRouter()

  const onSubmit = async (data: any) => {
    // console.log('data :>> ', data)

    let result
    try {
      result = await signIn('credentials', {
        ...data,
        email: data.email ? data.email.toLowerCase() : data.email,
        redirect: false,
      })

      if (result?.error) {
        return setError('email', { message: 'Invalid email/password.' })
      }

      // Push them to "/" and that route will figure out what to do next
      if (typeof window !== 'undefined') {
        // In order for Apollo to refresh with the user's new token, we redirect outside of Next
        // The performance is worse, but we're guaranteed to have things work
        window.location.href = '/'
      }
    } catch (error) {
      console.error('ERROR', error)
    }
  }

  return (
    <TemplateSplashContent>
      <Head>
        <title>Login</title>
      </Head>
      <VStack spacing={6}>
        <Box pt="6">
          <Logo />
        </Box>

        {router.query.action && router.query.action === 'registered' && (
          <Center>
            <Alert textColor="green.400">Thanks for registering! </Alert>
          </Center>
        )}

        <Header title="Sign in to your account" />
        <form className="w-72" onSubmit={handleSubmit(onSubmit)} noValidate>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <VStack alignItems="flex-start">
            <InputEmail
              label="Email"
              fieldId="email"
              errors={errors}
              register={register}
              setValue={setValue}
              onChange={clearErrors.bind(null, 'email')}
              registerOptions={{ required: 'Email is required' }}
            />
            <InputPassword
              label="Password"
              fieldId="password"
              errors={errors}
              register={register}
              setValue={setValue}
              onChange={clearErrors.bind(null, 'email')}
              registerOptions={{ required: 'Password is required' }}
            />
            <Box className="w-full text-center">
              <ButtonSubmit w="full" label="Sign In" />
            </Box>
          </VStack>
        </form>
        <Link href="/auth/forgot-password">Forgot password?</Link>
        <Box mt="5">
          Don&apos;t have an account? <Link href={process.env.NEXT_PUBLIC_SCROOBIOUS_PRICING_PAGE!}> Sign Up!</Link>
        </Box>
      </VStack>
    </TemplateSplashContent>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await getUserFromSession(context);

  if (user?.status === "INACTIVE") {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
  return {
    props: { csrfToken: await getCsrfToken(context) },
  }
}
