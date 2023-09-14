import { gql, useMutation } from '@apollo/client'
import { SuggestedResource, SuggestedResourceCreateInput } from '@binding'
import { Button } from '@chakra-ui/button'
import { Alert } from '@chakra-ui/react'
import { CodeListField, FileUpload, Header, InputField } from '@components'
import { FILE_TYPE_ACCEPT } from '@core/file-type'
import { processFormData } from '@core/form'
import { handleApolloMutation } from '@core/request'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

type SuggestedResourceFormProps = {
  suggestedResource?: SuggestedResource
  onSuccess: Function
}

const CREATE_MUTATION = gql`
  mutation createSuggestedResource($data: SuggestedResourceCreateInput!) {
    createSuggestedResource(data: $data) {
      id
    }
  }
`

const UPDATE_MUTATION = gql`
  mutation updateSuggestedResource($data: SuggestedResourceUpdateInput!, $where: SuggestedResourceWhereUniqueInput!) {
    updateSuggestedResource(data: $data, where: $where) {
      id
    }
  }
`

export const SuggestedResourceForm = function SuggestedResourceForm({
  suggestedResource,
  onSuccess,
}: SuggestedResourceFormProps) {
  const [isUpdate] = useState(!!suggestedResource)
  const [mutate, { data, loading, error }] = useMutation<{ createSuggestedResource: SuggestedResource }>(
    isUpdate ? UPDATE_MUTATION : CREATE_MUTATION,
  )
  const {
    register,
    formState: { isDirty, isValid, errors },
    handleSubmit,
    setError,
    control,
    clearErrors,
    setValue,
  } = useForm({ defaultValues: (suggestedResource as FieldValues) || {} })

  // console.log('props :>> ', suggestedResource, onSuccess)

  const onSubmit = async (rawFormData: any) => {
    const { suggestedResourceCategory, ...formData } = rawFormData // pull out fields we do not want to send
    const processedData = processFormData<SuggestedResourceCreateInput>(formData)

    let variables: any = {
      data: processedData,
    }
    // For update screen, add a where clause to update by ID
    if (suggestedResource) {
      variables = {
        ...variables,
        where: {
          id: suggestedResource.id,
        },
      }
    }

    const result = await handleApolloMutation(
      mutate({
        variables,
      }),
    )

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
      <Header title={isUpdate ? 'Update Resource' : 'Create Resource'} center />

      <form onSubmit={handleSubmit(onSubmit)} className="my-6">
        {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
        {errors.global && errors.global.message && (
          <Alert status="error" className="-mt-18 mb-4">
            {errors.global.message}
          </Alert>
        )}
        <InputField label="Company Name" fieldId="companyName" errors={errors} register={register} required />
        <InputField label="Url" fieldId="url" errors={errors} register={register} required />
        <InputField label="Description" fieldId="description" errors={errors} register={register} />
        <CodeListField
          label="Category"
          errors={errors}
          control={control}
          listName="suggestedResourceCategory"
          required
          fieldId="suggestedResourceCategoryId"
        />

        <FileUpload
          accept={FILE_TYPE_ACCEPT.image}
          label="Logo"
          buttonLabel="Upload Logo"
          errors={errors}
          register={register}
          setValue={setValue}
          clearErrors={clearErrors}
          required
          fieldId="logoFileId"
          initialFileUrl={suggestedResource?.logoFile.url}
          displayImage
        />

        <div className="text-center mt-8">
          <Button
            type="submit"
            width="120"
            colorScheme="orange"
            isLoading={loading || !!data}
            disabled={!isDirty && isValid}
            loadingText="Saving"
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  )
}
