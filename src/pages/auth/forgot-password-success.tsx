import { gql, useMutation } from '@apollo/client'
import { ExecutePasswordResetInput, PasswordResetCreateInput } from '@binding'
import { Alert, Box, VStack } from '@chakra-ui/react'
import { ButtonSubmit, Header, InputField, Link, Logo } from '@components'
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
interface ForgotPasswordSuccessProps {
  csrfToken: string
}

const MUTATION = gql`
  mutation requestPasswordReset($data: PasswordResetCreateInput!) {
    requestPasswordReset(data: $data)
  }
`

export default function ForgotPasswordSuccess({ csrfToken }: ForgotPasswordSuccessProps) {
  const router = useRouter()
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: { token: getSingleQueryParam(router.query, 'token') },
  })
  const [mutate, { data, loading }] = useMutation<{ requestPasswordReset: PasswordResetCreateInput }>(MUTATION)

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
        <title>Scroobious Password Reset</title>
      </Head>
      <VStack spacing={6}>
        <Box pt="6">
          <Logo />
        </Box>
        <>
          <Header title="Forgot Password" />

          {errors.global && errors.global.message && (
            <Alert status="error">
              <p>{errors.global.message}</p>
            </Alert>
          )}

          <p className="text-sm">
            Enter your email and we&apos;ll send you instructions on how to reset your password.
          </p>

          <form className="w-72" onSubmit={handleSubmit(onSubmit)} noValidate>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <InputField label="Email Address" fieldId="email" errors={errors} register={register} required />

            <ButtonSubmit label="Reset Password" isLoading={loading} disabled={loading || !!data} />
          </form>

          <Link href="/auth/login">Back to login</Link>
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
