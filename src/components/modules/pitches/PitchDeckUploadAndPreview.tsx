import { gql, useMutation } from '@apollo/client'
import { Pitch, PitchDeck, PitchDeckCreateExtendedInput } from '@binding'
import { Box, Center, Flex, Button as ChakraButton, Spacer, Spinner } from '@chakra-ui/react'
import { EmptyStateText, PDFViewer, Header, FileUpload } from '@components'
import React, { useRef, useState } from 'react'
import { FILE_TYPE_ACCEPT } from '@core/file-type'
import { useForm } from 'react-hook-form'
import { processFormData } from '@core/form'
import { handleApolloMutation } from '@core/request'

interface PitchDeckUploadAndPreviewProps {
  pitch: Pitch
  onUpload?: Function
}

const MUTATION = gql`
  mutation createPitchDeck($data: PitchDeckCreateExtendedInput!) {
    createPitchDeck(data: $data) {
      id
      file {
        url
      }
    }
  }
`

export function PitchDeckUploadAndPreview({ pitch, onUpload }: PitchDeckUploadAndPreviewProps) {
  const [mutate, { data, loading, error }] = useMutation<{ createPitchDeck: PitchDeck }>(MUTATION)
  const [isUploaded, setUploaded] = useState(false)
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
    handleSubmit,
  } = useForm()

  const onFormSubmit = async (data: any) => {
    const processedData = processFormData<PitchDeckCreateExtendedInput & { pitchDeckAWSUrl: string }>(data)

    const variables: any = {
      data: {
        pitchId: pitch.id,
        file: {
          url: processedData.pitchDeckAWSUrl,
        },
        draft: true,
      },
    }

    const result = await handleApolloMutation(
      mutate({
        variables,
      }),
    )

    if (!result.error && pitch && onUpload) {
      onUpload()
    }
  }

  const formSumbitRef = useRef<HTMLInputElement>(null)

  return (
    <Box bgColor="whiteAlpha.900" width="100%">
      <Box>
        <Header title="Upload Pitch Deck" />
      </Box>
      <Box className="px-4">
        {pitch.latestPitchDeck && <PDFViewer width={600} url={pitch.latestPitchDeck.file.url} controls download />}
        {!pitch.latestPitchDeck && (
          <Center width="100%">
            {isUploaded ? (
              <Spinner size="xl" emptyColor="gray.200" color="orange.500" />
            ) : (
              <EmptyStateText>
                You can upload your pitch deck when you're ready. <br/><br/>
                For best results, we recommend following the guidelines described in the "Pitch Deck Creation" module of PIP.
                <br/><br/>
                After you upload your deck, you will be able to:<br/>
                - Get feedback<br/>
                - Upload new versions of your deck<br/>
                - Publish your deck to Investors<br/>
              </EmptyStateText>
            )}
          </Center>
        )}
      </Box>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <input type="submit" ref={formSumbitRef} className="hidden" />
        <Flex px={4} pt={4}>
          <FileUpload
            accept={FILE_TYPE_ACCEPT.pdf}
            label="Pitch Deck"
            hideLabel
            buttonLabel={pitch.latestPitchDeck ? 'Upload New Pitch Deck (pdf)' : 'Upload Pitch Deck (pdf)'}
            errors={errors}
            register={register}
            setValue={setValue}
            clearErrors={clearErrors}
            colorScheme="green"
            onSuccess={() => {
              setUploaded(true)
              formSumbitRef.current?.click()
            }}
            required
            fieldId="pitchDeckAWSUrl"
            initialFileUrl=""
          />
        </Flex>
      </form>
    </Box>
  )
}
