import { gql, useMutation } from '@apollo/client'
import { Perk } from '@binding'
import { Button } from '@chakra-ui/button'
import { Alert } from '@chakra-ui/react'
import { CodeListField, FileUpload, Header, InputField } from '@components'
import { FILE_TYPE_ACCEPT } from '@core/file-type'
import { processFormData } from '@core/form'
import { handleApolloMutation } from '@core/request'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

type PerkFormProps = {
  perk?: Perk
  onSuccess: Function
}

const CREATE_MUTATION = gql`
  mutation createPerk($data: PerkCreateInput!) {
    createPerk(data: $data) {
      id
    }
  }
`

const UPDATE_MUTATION = gql`
  mutation updatePerk($data: PerkUpdateInput!, $where: PerkWhereUniqueInput!) {
    updatePerk(data: $data, where: $where) {
      id
    }
  }
`

export const PerkForm = function PerkForm({ perk, onSuccess }: PerkFormProps) {
  const [isUpdate] = useState(!!perk)
  const [mutate, { data, loading, error }] = useMutation<{ createPerk: Perk }>(
    isUpdate ? UPDATE_MUTATION : CREATE_MUTATION,
  )
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    control,
    clearErrors,
    setValue,
  } = useForm({ defaultValues: (perk as FieldValues) || {} })

  // console.log('props :>> ', perk, onSuccess)

  const onSubmit = async (rawFormData: any) => {
    const processedData = processFormData(rawFormData)
    // console.log('processedData :>> ', processedData)

    let variables: any = {
      data: processedData,
    }
    // For update screen, add a where clause to update by ID
    if (perk) {
      variables = {
        ...variables,
        where: {
          id: perk.id,
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
      <Header title={isUpdate ? 'Update Perk' : 'Create Perk'} center />

      <form onSubmit={handleSubmit(onSubmit)} className="my-6">
        {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
        {errors.global && errors.global.message && (
          <Alert status="error" className="-mt-18 mb-4">
            {errors.global.message}
          </Alert>
        )}
        <InputField label="Company Name" fieldId="companyName" errors={errors} register={register} required />
        <InputField label="Company Bio" fieldId="companyBio" errors={errors} register={register} required />
        <InputField
          type="textarea"
          label="Perk Description"
          fieldId="description"
          errors={errors}
          register={register}
          required
        />
        <InputField label="Url" fieldId="url" errors={errors} register={register} required />
        <CodeListField
          label="Category"
          errors={errors}
          control={control}
          listName="perkCategory"
          required
          fieldId="perkCategoryId"
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
          initialFileUrl={perk?.logoFile.url}
          displayImage
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
