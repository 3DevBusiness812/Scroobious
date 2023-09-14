import { gql, useMutation } from '@apollo/client'
import { User, UserUpdateInput } from '@binding'
import { Button } from '@chakra-ui/button'
import { Alert } from '@chakra-ui/react'
import { InputField } from '@components'
import { processFormData } from '@core/form'
import { handleApolloMutation } from '@core/request'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'

type AdminUserFormProps = {
  user: User
  onSuccess?: Function
}

const MUTATION = gql`
  mutation updateUser($data: UserCompleteInput!, $where: UserWhereUniqueInput!) {
    updateUser(data: $data, where: $where) {
      id
      status
    }
  }
`

export const AdminUserForm = function AdminUserForm({ user, onSuccess }: AdminUserFormProps) {
  const [mutate, { data, loading, error }] = useMutation<{ updateUser: User }>(MUTATION)
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    setValue,
  } = useForm({ defaultValues: (user as FieldValues) || {} })

  // console.log('props :>> ', inputReadonly, readonly, User)

  const onSubmit = async (rawFormData: any) => {
    const processedData = processFormData<UserUpdateInput>(rawFormData)
    console.log('processedData :>> ', processedData)

    const variables: any = {
      data: processedData,
      where: {
        id: user.id,
      },
    }

    const result = await handleApolloMutation(
      mutate({
        variables,
      }),
    )

    if (!result.errors) {
      return onSuccess && onSuccess(result)
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
        {errors.global && errors.global.message && (
          <Alert status="error" className="-mt-18 mb-4">
            {errors.global.message}
          </Alert>
        )}

        <InputField
          // readonly={readonly}
          type="textarea"
          label="Reviewer Notes"
          fieldId="reviewerNotes"
          errors={errors}
          register={register}
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
