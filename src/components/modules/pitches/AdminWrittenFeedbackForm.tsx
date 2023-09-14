import { gql, useMutation } from '@apollo/client'
import { PitchWrittenFeedback, PitchWrittenFeedbackCompleteInput } from '@binding'
import { Button } from '@chakra-ui/button'
import { Alert, Box, Center, FormLabel } from '@chakra-ui/react'
import { FileUpload, InputField, PDFViewer } from '@components'
import { FILE_TYPE_ACCEPT } from '@core/file-type'
import { processFormData } from '@core/form'
import { handleApolloMutation } from '@core/request'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

type AdminWrittenFeedbackFormProps = {
  pitchWrittenFeedback: PitchWrittenFeedback
  readonly?: boolean
  onSuccess?: Function
}

const MUTATION = gql`
  mutation completePitchWrittenFeedback(
    $data: PitchWrittenFeedbackCompleteInput!
    $where: PitchWrittenFeedbackWhereUniqueInput!
  ) {
    completePitchWrittenFeedback(data: $data, where: $where) {
      id
      status
    }
  }
`

export const AdminWrittenFeedbackForm = function AdminWrittenFeedbackForm({
  pitchWrittenFeedback,
  readonly: inputReadonly,
  onSuccess,
}: AdminWrittenFeedbackFormProps) {
  const [readonly] = useState(() => {
    return inputReadonly || pitchWrittenFeedback.status === 'COMPLETE'
  })
  const [mutate, { data, loading, error }] =
    useMutation<{ completePitchWrittenFeedback: PitchWrittenFeedback }>(MUTATION)
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    setValue,
  } = useForm({ defaultValues: (pitchWrittenFeedback as FieldValues) || {} })

  // console.log('props :>> ', inputReadonly, readonly, pitchWrittenFeedback)

  const onSubmit = async (rawFormData: any) => {
    const processedData =
      processFormData<PitchWrittenFeedbackCompleteInput & { reviewedPitchDeckUrl: string }>(rawFormData)
    // console.log('processedData :>> ', processedData)

    const variables: any = {
      data: {
        pitchDeck: {
          pitchId: pitchWrittenFeedback.pitchId,
          file: {
            url: processedData.reviewedPitchDeckUrl,
          },
        },
        reviewerNotes: processedData.reviewerNotes,
      },
      where: {
        id: pitchWrittenFeedback.id,
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

        {((getValues as any)('originalPitchDeckUrl') || pitchWrittenFeedback.originalPitchDeck?.file?.url) && (
          <div className="mb-4">
            <FormLabel>Founder Pitch Deck</FormLabel>
            <Box className="w-full pt-6">
              <PDFViewer
                width={400}
                url={(getValues as any)('originalPitchDeckUrl') || pitchWrittenFeedback.originalPitchDeck?.file?.url}
                controls
              />
            </Box>
            <Center>
              <a
                className="underline"
                href={(getValues as any)('originalPitchDeckUrl') || pitchWrittenFeedback.originalPitchDeck?.file?.url}
                download
              >
                Download
              </a>
            </Center>
          </div>
        )}

        <FileUpload
          readonly={readonly}
          accept={FILE_TYPE_ACCEPT.pdf}
          label="Reviewer Pitch Deck"
          buttonLabel="Upload Pitch Deck"
          errors={errors}
          register={register}
          setValue={setValue}
          clearErrors={clearErrors}
          required
          fieldId="reviewedPitchDeckUrl"
          initialFileUrl={pitchWrittenFeedback.reviewedPitchDeck?.file?.url}
          displayImage
        />

        {((getValues as any)('reviewedPitchDeckUrl') || pitchWrittenFeedback.reviewedPitchDeck?.file?.url) && (
          <div className="mb-4">
            <FormLabel>Reviewer Pitch Deck</FormLabel>
            <Box className="w-full py-6">
              <PDFViewer
                width={400}
                url={(getValues as any)('reviewedPitchDeckUrl') || pitchWrittenFeedback.reviewedPitchDeck?.file?.url}
                controls
              />
            </Box>
            <Center>
              <a
                className="underline"
                href={(getValues as any)('reviewedPitchDeckUrl') || pitchWrittenFeedback.reviewedPitchDeck?.file?.url}
                download
              >
                Download
              </a>
            </Center>
          </div>
        )}

        <InputField
          readonly={readonly}
          type="textarea"
          label="Reviewer Notes"
          fieldId="reviewerNotes"
          errors={errors}
          register={register}
        />

        {!readonly && (
          <div className="text-center mt-8">
            <Button type="submit" width="120" colorScheme="orange" isLoading={loading || !!data} loadingText="Saving">
              Submit
            </Button>
          </div>
        )}
      </form>
    </>
  )
}
