import { gql, useMutation } from '@apollo/client'
import { ExecutePasswordResetInput, PasswordResetCreateInput } from '@binding'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Alert, Box, Button, Link as ChakraLink, VStack } from '@chakra-ui/react'
import { ButtonSubmit, Header, InputField, Logo } from '@components'
import { processFormData } from '@core/form'
import { getSingleQueryParam } from '@core/querystring'
import { handleApolloMutation } from '@core/request'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getCsrfToken } from 'next-auth/client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form'
import { TemplateSplashContent } from '../../templates/TemplateSplashContent'

interface FormData {
  token: string
  global?: string // Needed for global error typing
}
interface ForgotPasswordProps {
  csrfToken: string
}

const MUTATION = gql`
  mutation requestPasswordReset($data: PasswordResetCreateInput!) {
    requestPasswordReset(data: $data)
  }
`

export default function ForgotPassword({ csrfToken }: ForgotPasswordProps) {
  const router = useRouter()
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
    watch,
  } = useForm<FormData>({
    defaultValues: { token: getSingleQueryParam(router.query, 'token') },
  })
  const [mutate, { data, loading }] = useMutation<{ requestPasswordReset: PasswordResetCreateInput }>(MUTATION)

  const email = watch('email' as any)

  const onSubmit = async (formData: any) => {
    const processedData = processFormData<ExecutePasswordResetInput>(formData)
    // console.log('processedData :>> ', processedData)

    const result = await handleApolloMutation(
      mutate({
        variables: {
          data: processedData,
        },
      }),
    )
    // console.log('result :>> ', result)

    if (!result.errors) {
      return // Do nothing, we'll just display a success message using "data" come back from the mutation
    }

    // Now handle errors
    Object.keys(result.errors).forEach((key: string) => {
      setError(key as any, { message: result.errors[key] })
    })
  }

  return (
    <TemplateSplashContent>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <VStack>
        <Box pt="6">
          <Logo />
        </Box>
        <>
          {errors.global && errors.global.message && (
            <Alert status="error">
              <p>{errors.global.message}</p>
            </Alert>
          )}

          {/* Once form has been submitted */}
          {!data && (
            <>
              <Header title="Forgot Password" />
              <form className="w-72" onSubmit={handleSubmit(onSubmit)} noValidate>
                <p className="text-sm pb-6">
                  Enter your email and we&apos;ll send you instructions on how to reset your password.
                </p>
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <InputField label="Email Address" fieldId="email" errors={errors} register={register} required />

                <ButtonSubmit label="Reset Password" w={'full'} isLoading={loading} disabled={loading || !!data} />
              </form>

              <Button
                pt={4}
                leftIcon={<ArrowBackIcon />}
                colorScheme="black"
                variant="link"
                fontWeight={'medium'}
                onClick={() => router.push('/auth/login')}
              >
                Back to log in
              </Button>
            </>
          )}

          {/* Once form has been submitted */}
          {data && (
            <>
              <Header title="Check your email" />

              <p className="text-sm">We sent a password reset email to {email}</p>

              <p className="text-sm">
                <span className="mr-2"> Didn&apos;t receive the email?</span>
                <ChakraLink onClick={handleSubmit(onSubmit)}>Resend Email</ChakraLink>
              </p>
            </>
          )}
        </>
      </VStack>
    </TemplateSplashContent>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    props: { csrfToken: await getCsrfToken(context) },
  }
}
