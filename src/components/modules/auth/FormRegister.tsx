import { Box, Center, Link, Text, VStack } from '@chakra-ui/react'
import { Alert, ButtonSubmit, FileUpload, InputCheckbox, InputEmail, InputPassword, TextField } from '@components'
import { useAlert } from '@core/alert.provider'
import { FILE_TYPE_ACCEPT } from '@core/file-type'
import { extractErrors, isApiError } from '@core/request'
import { registerUser } from '@src/auth/register.mutation'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getCsrfToken, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { getUserFromSession } from '@src/auth/get-user'

export interface FormRegisterProps {
  registrationType: any
  csrfToken: string
  v2ReviewerRedirectUrl?: string
}

export const FormRegister = function FormRegister({
  registrationType,
  csrfToken,
  v2ReviewerRedirectUrl,
}: FormRegisterProps) {
  const router = useRouter()
  const checkoutUrl = router.query.checkout

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    watch,
  } = useForm({ defaultValues: (router.query.password && (router.query.email as FieldValues)) || {} })

  const password = useRef({})
  password.current = watch('password', '')
  const { setAlert } = useAlert()

  const onSubmit = async (data: any) => {
    data = {
      ...data,
      email: data.email ? data.email.toLowerCase() : data.email,
      type: registrationType,
    }
    const response = await registerUser(data)
    // console.log('data :>> ', data)

    if (isApiError(response)) {
      const err: any = extractErrors(response)
      // console.log('err :>> ', err)

      Object.keys(err).forEach((key: string) => {
        setError(key, { message: err[key] })
      })

      // If any global errors were added, clear them out so the user can try again
      setTimeout(() => {
        clearErrors('global')
      }, 10000)
      return false
    }

    if (registrationType === 'REVIEWER' && v2ReviewerRedirectUrl) {
      setAlert({
        message: 'Successfully registered... redirecting to login',
        type: 'notification',
        status: 'success',
      })

      router.push(v2ReviewerRedirectUrl)
    } else {
      setAlert({
        message: 'Successfully registered... redirecting to plans',
        type: 'notification',
        status: 'success',
      })
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      }).then((value) => {
        router.push(`/register?action=completed&plan=${registrationType}&email=${data.email}&checkout=${checkoutUrl}`)
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <VStack alignItems="flex-start" w="100%">
        {errors.global && errors.global.message && (
          <Alert status="error">
            <p>{errors.global.message}</p>
          </Alert>
        )}
        <InputEmail
          label="Email"
          fieldId="email"
          isDisabled={!!router.query.email} // Allowing user to change this after paying would always be a bug
          errors={errors}
          register={register}
          setValue={setValue}
          registerOptions={{ required: 'Email is required' }}
        />
        <TextField
          label="Full Name"
          fieldId="name"
          errors={errors}
          register={register}
          setValue={setValue}
          registerOptions={{
            required: 'Full name is required',
          }}
        />
        <InputPassword
          required
          label="Password"
          fieldId="password"
          errors={errors}
          register={register}
          setValue={setValue}
        />

        <InputPassword
          label="Confirm Password"
          fieldId="confirmPassword"
          errors={errors}
          register={register}
          setValue={setValue}
          registerOptions={{
            required: 'Confirm Password is required',
            validate: (value: string) => value === password.current || 'The passwords do not match',
          }}
        />
        <div hidden>
          <FileUpload
            className="display-none"
            accept={FILE_TYPE_ACCEPT.image}
            label="Profile Picture"
            buttonLabel="Upload Picture"
            errors={errors}
            register={register}
            setValue={setValue}
            clearErrors={clearErrors}
            fieldId="profilePictureFileId"
            initialFileUrl={'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'}
          />
        </div>

        {registrationType === 'INVESTOR' ? (
          <>
            <InputCheckbox
              label="I am an Accredited Investor"
              fieldId="isAccredited"
              errors={errors}
              register={register}
              registerOptions={{ required: 'Field is required' }}
              isRequired
              fontSize="sm"
            />
            <Box pl="3" pb={4}>
              <Text fontSize="sm">For more information on accredited investor requirements, visit</Text>
              <Link
                textColor="blue.500"
                fontSize="sm"
                href="https://www.investopedia.com/terms/a/accreditedinvestor.asp"
              >
                https://www.investopedia.com/terms/a/accreditedinvestor.asp
              </Link>
            </Box>
          </>
        ) : (
          ''
        )}

        <Center className="w-full">
          <ButtonSubmit width="full" label="Sign Up" />
        </Center>
      </VStack>
    </form>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    props: { csrfToken: await getCsrfToken(context) },
  }
}
