import { gql, useMutation } from '@apollo/client'
import { Pitch } from '@binding'
import { Button } from '@chakra-ui/button'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { Alert, HStack } from '@chakra-ui/react'
import { CodeListField, SelectField, TextareaField } from '@components'
import { processFormData } from '@core/form'
import { handleApolloMutation } from '@core/request'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

const pick = require('lodash.pick')

type PitchFormProps = {
  pitch: Pitch
  onSuccess?: Function
}

const UPDATE_MUTATION = gql`
  mutation updatePitch($data: PitchUpdateInput!, $where: PitchWhereUniqueInput!) {
    updatePitch(data: $data, where: $where) {
      id
    }
  }
`

export const PitchForm = function PitchForm({ pitch, onSuccess }: PitchFormProps) {
  const [success, SetSuccess] = useState(false)
  const [isUpdate] = useState(!!pitch)
  const [mutate, { data, loading, error }] = useMutation<{ updatePitch: Pitch }>(UPDATE_MUTATION)
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    control,
    clearErrors,
    setValue,
  } = useForm({
    defaultValues:
      (pick(pitch, [
        'shortDescription',
        'presentationStatus',
        'deckComfortLevel',
        'presentationComfortLevel',
      ]) as FieldValues) || {},
  })

  console.log('pitch :>> ', pitch)

  const [OPTIONS_ONE_TO_TEN] = useState([
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '10', value: 10 },
  ])

  const onSubmit = async (rawFormData: any) => {
    const processedData = processFormData(rawFormData)
    // console.log('processedData :>> ', processedData)

    let variables: any = {
      data: processedData,
    }
    // For update screen, add a where clause to update by ID
    if (pitch) {
      variables = {
        ...variables,
        where: {
          id: pitch.id,
        },
      }
    }

    const result = await handleApolloMutation(
      mutate({
        variables,
      }),
    )

    if (!result.errors) {
      SetSuccess(true)
      setTimeout(() => {
        SetSuccess(false)
      }, 3000)

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
    <form onSubmit={handleSubmit(onSubmit)} className="my-6">
      {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
      {errors.global && errors.global.message && (
        <Alert status="error" className="-mt-18 mb-4">
          {errors.global.message}
        </Alert>
      )}
      <TextareaField
        label="Short Company Description"
        fieldId="shortDescription"
        errors={errors}
        register={register}
        isRequired
      />

      <CodeListField
        label="Have you presented your pitch before?"
        errors={errors}
        control={control}
        listName="presentationStatus"
        required
        fieldId="presentationStatus"
      />

      <SelectField
        label="Deck Comfort Level"
        fieldId="deckComfortLevel"
        control={control}
        errors={errors}
        required
        options={OPTIONS_ONE_TO_TEN}
      />

      <SelectField
        label="Presentation Comfort Level"
        fieldId="presentationComfortLevel"
        control={control}
        errors={errors}
        required
        options={OPTIONS_ONE_TO_TEN}
      />

      <HStack className="text-center mt-8">
        <div className="flex-1" />
        <Button type="submit" width="120" colorScheme="orange" isLoading={loading} loadingText="Saving">
          Submit
        </Button>
        <div className="flex-1 text-left">{success && <CheckCircleIcon ml={2} fontSize={20} color="green.400" />}</div>
      </HStack>
    </form>
  )
}
