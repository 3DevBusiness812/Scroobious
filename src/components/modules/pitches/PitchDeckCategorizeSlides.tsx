import { gql, useMutation } from '@apollo/client'
import { Pitch, PitchDeck, PitchDeckCreateExtendedInput } from '@binding'
import { Box, Center, Flex, Button as ChakraButton, Spacer, Spinner, HStack, Heading, Button } from '@chakra-ui/react'
import { EmptyStateText, PDFViewer, Header, FileUpload } from '@components'
import React, { useRef, useState } from 'react'
import { FILE_TYPE_ACCEPT } from '@core/file-type'
import { useForm } from 'react-hook-form'
import { processFormData } from '@core/form'
import { handleApolloMutation } from '@core/request'

interface PitchDeckCategorizeSlidesProps {
  pitch: Pitch
  onUpload?: Function
  onNextClick?: Function
  nextLabel?: string
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

export function PitchDeckCategorizeSlides({ pitch, onUpload, onNextClick, nextLabel }: PitchDeckCategorizeSlidesProps) {
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

    if (!result.error && onUpload) {
      onUpload()
    }
  }

  const formSumbitRef = useRef<HTMLInputElement>(null)

  return (
    <Box bgColor="whiteAlpha.900" width="100%">
      <Box>
        <Box>
          <Header title="Let’s Categorize Your Slides" />
        </Box>
        <Box className="px-4">
          <div className="flex-1 space-y-6">
            <p>Now that you have uploaded your pitch deck you are ready to categorize your slides.  This will help you put the lessons learned in PiP into practice while making it easy for investors to quickly find answers to common questions.</p>
            <ul className="list-disc pl-4 space-y-4">
              <li>
                <h4 className="font-bold">Next, you will be asked to assign each slide to a section.</h4>
                <ul className="list-disc pl-4 space-y-2">
                  <li className="space-y-2">
                    <div>
                      The app will ask you to label each slide with the corresponding section from PiP before you can
                      submit it for feedback.
                    </div>
                    <div className="space-y-1">
                      <p>For example:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Slide 1 — Title Slide</li>
                        <li>Slide 2 — Mission</li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Once you have categorized each slide</span>, you will be able to submit your deck for review or publish directly to the investor portal.
              </li>
            </ul>
          </div>
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
            <Spacer />
            {pitch.latestPitchDeck && onNextClick && (
              <div className="space-y-4">
                <ChakraButton
                  p={4}
                  mt={2}
                  size="sm"
                  colorScheme="orange"
                  onClick={() => onNextClick()}
                  border="2px"
                  borderColor="orange.500"
                  fontWeight="normal"
                >
                  {nextLabel || 'Next'}
                </ChakraButton>
              </div>
            )}
          </Flex>
        </form>

        <Box>
          <Header title="Preview Pitch Deck" />
        </Box>

        <Box className="p-4">
          {pitch.latestPitchDeck && <PDFViewer width={600} url={pitch.latestPitchDeck.file.url} controls download />}
          {!pitch.latestPitchDeck && (
            <Center width="100%">
              {isUploaded ? (
                <Spinner size="xl" emptyColor="gray.200" color="orange.500" />
              ) : (
                <EmptyStateText>
                  You can upload your pitch deck when you're ready. <br />
                  <br />
                  For best results, we recommend following the guidelines described in the "Pitch Deck Creation" module
                  of PIP.
                  <br />
                  <br />
                  After you upload your deck, you will be able to:
                  <br />
                  - Get feedback
                  <br />
                  - Upload new versions of your deck
                  <br />
                  - Publish your deck to Investors
                  <br />
                </EmptyStateText>
              )}
            </Center>
          )}
        </Box>
      </Box>
    </Box>
  )
}
