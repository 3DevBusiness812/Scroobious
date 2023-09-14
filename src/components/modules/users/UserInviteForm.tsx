import { gql, useMutation } from '@apollo/client'
import { UserInvite, UserInviteCreateInput } from '@binding'
import { Button } from '@chakra-ui/button'
import { Alert } from '@chakra-ui/react'
import { Header, InputField, SelectField } from '@components'
import { processFormData } from '@core/form'
import { handleApolloMutation } from '@core/request'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

type UserInviteFormProps = {
  userInvite?: UserInvite
  onSuccess: Function
}

const CREATE_MUTATION = gql`
  mutation createUserInvite($data: UserInviteCreateInput!) {
    createUserInvite(data: $data) {
      id
    }
  }
`

export const UserInviteForm = function UserInviteForm({ userInvite: userinvite, onSuccess }: UserInviteFormProps) {
  const [isUpdate] = useState(!!userinvite)
  const [mutate, { data, loading, error }] = useMutation<{ createUserInvite: UserInvite }>(CREATE_MUTATION)
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    control,
    clearErrors,
  } = useForm({ defaultValues: (userinvite as FieldValues) || {} })

  const onSubmit = async (rawFormData: any) => {
    const processedData = processFormData<UserInviteCreateInput>(rawFormData)
    // console.log('processedData :>> ', processedData)

    const variables: any = {
      data: processedData,
    }

    const result = await handleApolloMutation(
      mutate({
        variables,
      }),
    )

    // console.log('result :>> ', result)

    if (!result.errors) {
      return onSuccess(result)
    }

    // Now handle errors
    Object.keys(result.errors).forEach((key: string) => {
      setError(key, { message: result.errors[key] })
    })

    // If any global errors were added, clear them out so the user can try again
    setTimeout(() => {
      clearErrors('global')
    }, 5000)

    return false
  }

  return (
    <>
      <Header title={isUpdate ? 'Update UserInvite' : 'Create UserInvite'} center />

      {errors.global && errors.global.message && (
        <Alert status="error" className="-mt-18 mb-4">
          {errors.global.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="my-6">
        {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
        <InputField label="Email Address" fieldId="email" errors={errors} register={register} required />
        <SelectField
          label="User Type"
          fieldId="userType"
          control={control}
          errors={errors}
          required
          options={[{ label: 'Reviewer', value: 'REVIEWER' }]}
        />

        <div className="text-center mt-8">
          <Button type="submit" width="120" colorScheme="orange" isLoading={loading || !!data} loadingText="Saving">
            Submit
          </Button>
        </div>
      </form>
    </>
  )
}
