import { gql, useMutation } from '@apollo/client'
import { ExecutePasswordResetInput, PasswordResetCreateInput } from '@binding'
import { Alert, Box, VStack } from '@chakra-ui/react'
import { ButtonSubmit, Header, InputPassword, Link, Logo } from '@components'
import { processFormData } from '@core/form'
import { getSingleQueryParam } from '@core/querystring'
import { handleApolloMutation } from '@core/request'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getCsrfToken } from 'next-auth/client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { TemplateSplashContent } from '../../templates/TemplateSplashContent'

interface FormData {
  token: string
  password: string
  confirmPassword: string
  global?: string // Needed for global error typing
}
interface PasswordResetProps {
  csrfToken: string
}

const MUTATION = gql`
  mutation executePasswordReset($data: ExecutePasswordResetInput!) {
    executePasswordReset(data: $data)
  }
`

export default function PasswordReset({ csrfToken }: PasswordResetProps) {
  const router = useRouter()
  const {
    register,
    formState: { errors },
    setError,
    setValue,
    handleSubmit,
    watch,
  } = useForm<FormData>({
    defaultValues: { token: getSingleQueryParam(router.query, 'token') },
  })
  const [mutate, { loading }] = useMutation<{ executePasswordReset: ExecutePasswordResetInput }>(MUTATION)

  const password = useRef({}) as any
  password.current = watch('password' as any, '')

  const onSubmit = async (data: any) => {
    const processedData = processFormData<PasswordResetCreateInput>(data)
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
      return router.push('/auth/password-reset-success')
    }

    // Now handle errors
    Object.keys(result.errors).forEach((key: string) => {
      setError(key as any, { message: result.errors[key] })
    })

    return false
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
          <Header title="Set your new password" />
          {errors.global && errors.global.message && (
            <Alert status="error">
              <p>{errors.global.message}</p>
            </Alert>
          )}

          <form className="w-72" onSubmit={handleSubmit(onSubmit)} noValidate>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <VStack spacing={6} alignItems="flex-start">
              <InputPassword
                label="Password"
                fieldId="password"
                errors={errors}
                register={register}
                setValue={setValue}
                registerOptions={{ required: 'Password is required' }}
              />

              <InputPassword
                label="Confirm Password"
                fieldId="confirmPassword"
                errors={errors}
                register={register}
                registerOptions={{
                  required: 'Confirm Password is required',
                  validate: (value: string) => value === password.current || 'The passwords do not match',
                }}
                setValue={setValue}
              />

              <ButtonSubmit label="Reset Password" isLoading={loading} />
            </VStack>
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
