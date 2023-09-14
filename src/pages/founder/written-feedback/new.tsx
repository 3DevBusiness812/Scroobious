import { gql, useMutation } from '@apollo/client'
import { initServerSideClient } from '@core/apollo'
import { PitchWrittenFeedback, PitchWrittenFeedbackRequestInput, Pitch } from '@binding'
import { Box, Button, Heading, HStack } from '@chakra-ui/react'
import { AppNavigation, Card, FileUpload, PDFViewer } from '@components'
import { FILE_TYPE_ACCEPT } from '@core/file-type'
import { processFormData } from '@core/form'
import { getSingleQueryParam } from '@core/querystring'
import { handleApolloMutation } from '@core/request'
import { protect } from '@core/server'
import { themeColors } from '@core/theme-colors'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const MUTATION = gql`
  mutation requestPitchWrittenFeedback($data: PitchWrittenFeedbackRequestInput!) {
    requestPitchWrittenFeedback(data: $data) {
      id
      status
      ownerId
      pitch {
        id
        userId
        createdAt
        activePitchDeck {
          id
          status
          pitchId
          createdAt
          file {
            id
            url
          }
        }
      }
    }
  }
`

const PITCH_DETAIL_QUERY = gql`
  query PitchDetailQuery($pitchWhere: PitchWhereUniqueInput!) {
    pitch(where: $pitchWhere) {
      id
      latestPitchDeck {
        file {
          url
        }
        status
      }
      activePitchDeck {
        file {
          url
        }
        status
      }
    }
  }
`

type WrittenFeedbackNewPageProps = {
  pitchId: string
  pitch: Pitch
  courseProductId: string
}

export default function WrittenFeedbackNewPage({ pitchId, courseProductId, pitch }: WrittenFeedbackNewPageProps) {
  const {
    register,
    formState: { errors },
    setError,
    setValue,
    getValues,
    clearErrors,
    handleSubmit,
  } = useForm()
  const [mutate, { data, loading, error }] =
    useMutation<{ requestPitchWrittenFeedback: PitchWrittenFeedback }>(MUTATION)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const onSubmit = async (rawFormData: any) => {
    const processedData = processFormData<PitchWrittenFeedbackRequestInput & { pitchDeckAWSUrl: string }>(rawFormData)

    const result = await handleApolloMutation(
      mutate({
        variables: {
          data: {
            pitchId,
            pitchDeck: {
              pitchId,
              file: {
                url: processedData.pitchDeckAWSUrl,
              },
            },
            courseProductId,
          },
        },
      }),
    )

    if (!result.errors) {
      router.push({
        pathname: `/founder/prepare-pitch-deck/${result.data.requestPitchWrittenFeedback.id}`,
      })
      return
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
    <AppNavigation isLoading={isLoading}>
      <Card className="my-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex space-x-8 p-4">
          <div className="space-y-6">
            <Heading size="md">Current Pitch Deck</Heading>
            {(getValues as any)('pitchDeckAWSUrl') ? (
              <div className="">
                <PDFViewer height={340} url={(getValues as any)('pitchDeckAWSUrl')} controls />
              </div>
            ) : (
              <div className="h-96 w-144 mx-3 my-0.5 flex items-center justify-center">No pitch deck uploaded yet</div>
            )}
            <div className="flex justify-center">
              <FileUpload
                accept={FILE_TYPE_ACCEPT.pdf}
                label="Pitch Deck"
                hideLabel
                buttonLabel="Upload a New Deck (PDF)"
                errors={errors}
                setValue={setValue}
                clearErrors={clearErrors}
                register={register}
                required={!pitch?.activePitchDeck?.file}
                fieldId="pitchDeckAWSUrl"
                initialFileUrl={(pitch?.activePitchDeck?.file?.url || pitch?.latestPitchDeck?.file?.url) ?? ''}
              />
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <Heading size="md">Request Written Feedback</Heading>
            <p>Now that you have uploaded your pitch deck you are ready to request written feedback.</p>
            <ul className="list-disc pl-4 space-y-4">
              <li>
                <h4 className="font-bold">First, make sure you see the latest version of your deck.</h4>
                <ul className="list-disc pl-4 space-y-2">
                  <li>The most recent version of your deck will be reviewed.</li>
                  <li>If this is not the most recent version, please upload that now.</li>
                </ul>
              </li>
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
                        <li>…</li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Once you have categorized each slide</span>, you can submit your deck for
                review.
              </li>
            </ul>
            <HStack flex={1} alignItems="center" justifyContent="center" py={4}>
              <Button type="submit" color="white" bgColor={themeColors.primary[500]}>
                Next, Categorize Your Slides
              </Button>
            </HStack>
          </div>
        </form>
      </Card>
    </AppNavigation>
  )
}

export const getServerSideProps: GetServerSideProps = protect(async (context: GetServerSidePropsContext) => {
  const client = initServerSideClient(context)
  const pitchId = getSingleQueryParam(context.query, 'pitchId')
  const courseProductId = getSingleQueryParam(context.query, 'courseProductId')

  if (!pitchId) {
    throw new Error('pitchId is required')
  }
  if (!courseProductId) {
    throw new Error('courseProductId is required')
  }

  const variables = {
    pitchWhere: {
      id: pitchId,
    },
  }

  const payload = await client.query({
    query: PITCH_DETAIL_QUERY,
    variables,
  })

  const props = {
    pitchId,
    pitch: payload.data.pitch,
    courseProductId,
  }
  // console.log(`props`, props)

  return { props }
})
