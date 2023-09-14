import { gql, useMutation } from '@apollo/client'
import { PitchMeetingFeedback, PitchMeetingFeedbackCompleteInput } from '@binding'
import { Button } from '@chakra-ui/button'
import { Alert, Box, Center, FormLabel } from '@chakra-ui/react'
import { FileUpload, InputField } from '@components'
import { FILE_TYPE_ACCEPT } from '@core/file-type'
import { processFormData } from '@core/form'
import { handleApolloMutation } from '@core/request'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import ReactPlayer from 'react-player'

type AdminMeetingFeedbackFormProps = {
  pitchMeetingFeedback: PitchMeetingFeedback
  readonly?: boolean
  onSuccess?: Function
}

const MUTATION = gql`
  mutation completePitchMeetingFeedback(
    $data: PitchMeetingFeedbackCompleteInput!
    $where: PitchMeetingFeedbackWhereUniqueInput!
  ) {
    completePitchMeetingFeedback(data: $data, where: $where) {
      id
      status
    }
  }
`

export const AdminMeetingFeedbackForm = function AdminMeetingFeedbackForm({
  pitchMeetingFeedback,
  readonly: inputReadonly,
  onSuccess,
}: AdminMeetingFeedbackFormProps) {
  const [readonly] = useState(() => {
    return inputReadonly || pitchMeetingFeedback.status === 'COMPLETE'
  })
  const [mutate, { data, loading, error }] =
    useMutation<{ completePitchMeetingFeedback: PitchMeetingFeedback }>(MUTATION)
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    setValue,
  } = useForm({ defaultValues: (pitchMeetingFeedback as FieldValues) || {} })

  // console.log('props :>> ', inputReadonly, readonly, pitchMeetingFeedback)

  const onSubmit = async (rawFormData: any) => {
    const processedData = processFormData<PitchMeetingFeedbackCompleteInput & { recordingFileUrl: string }>(rawFormData)
    // console.log('processedData :>> ', processedData)

    const variables: any = {
      data: {
        file: {
          url: processedData.recordingFileUrl,
        },
      },
      where: {
        id: pitchMeetingFeedback.id,
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

        <FileUpload
          readonly={readonly}
          accept={FILE_TYPE_ACCEPT.video}
          label="1:1 Pitch Video"
          buttonLabel="Upload Pitch Video"
          errors={errors}
          register={register}
          setValue={setValue}
          clearErrors={clearErrors}
          required
          fieldId="recordingFileUrl"
          initialFileUrl={pitchMeetingFeedback.recordingFile?.url}
          displayImage
        />

        {((getValues as any)('recordingFileUrl') || pitchMeetingFeedback.recordingFile?.url) && (
          <div className="mb-4">
            <FormLabel>1:1 Review Video</FormLabel>
            <Box className="w-full py-6">
              <ReactPlayer
                width="100%"
                url={(getValues as any)('recordingFileUrl') || pitchMeetingFeedback.recordingFile?.url}
                controls
              />
            </Box>
            <Center>
              <a
                className="underline"
                href={(getValues as any)('recordingFileUrl') || pitchMeetingFeedback.recordingFile?.url}
                download
              >
                Download
              </a>
            </Center>
          </div>
        )}

        {(getValues as any)('reviewerNotes') && (
          <InputField
            readonly={readonly}
            type="textarea"
            label="Reviewer Notes"
            fieldId="reviewerNotes"
            errors={errors}
            register={register}
          />
        )}
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
