import { gql, useMutation } from '@apollo/client'
import { PitchMeetingFeedback, PitchMeetingFeedbackRequestInput } from '@binding'
import { Button, Heading, Text } from '@chakra-ui/react'
import { AppNavigation, Card, InputCheckbox } from '@components'
import { processFormData } from '@core/form'
import { getSingleQueryParam } from '@core/querystring'
import { handleApolloMutation } from '@core/request'
import { protect } from '@core/server'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const MUTATION = gql`
  mutation requestPitchMeetingFeedback($data: PitchMeetingFeedbackRequestInput!) {
    requestPitchMeetingFeedback(data: $data) {
      id
      status
      ownerId
    }
  }
`

type MeetingFeedbackNewPageProps = {
  pitchId: string
  courseProductId: string
  ownerId: string
}

export default function MeetingFeedbackNewPage({ pitchId, courseProductId, ownerId }: MeetingFeedbackNewPageProps) {
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
    useMutation<{ requestPitchMeetingFeedback: PitchMeetingFeedback }>(MUTATION)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const onSubmit = async (rawFormData: any) => {
    // console.log('getValues() :>> ', getValues())
    // console.log('errors :>> ', errors)
    // console.log('rawFormData :>> ', rawFormData)

    const processedData = processFormData<PitchMeetingFeedbackRequestInput & { pitchDeckAWSUrl: string }>(rawFormData)
    // console.log('processedData :>> ', processedData)

    const variables: any = {
      data: processedData,
    }

    const result = await handleApolloMutation(
      mutate({
        variables: {
          data: {
            pitchId,
            courseProductId,
            ownerId
          },
        },
      }),
    )
    // console.log('result :>> ', result)

    if (!result.errors) {
      router.push({
        pathname: `/founder/meeting-feedback/${result.data.requestPitchMeetingFeedback.id}`,
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

  const validate = (value: string) => {
    // console.log('value :>> ', value)
    return value === '1' || 'You need to answer yes'
  }

  return (
    <AppNavigation isLoading={isLoading}>
      <Card className="mt-4" title="Schedule 1:1 Pitch Review">
        <form onSubmit={handleSubmit(onSubmit)} className="my-6 space-y-4 ">
          <Heading size="xs">Congratulations on crafting your pitch deck!</Heading>

          <Text fontSize="sm">
            Click the checkbox letting us know you&apos;ve scheduled time and submit your meeting request.
          </Text>

          <InputCheckbox
            label="I've scheduled my meeting"
            fieldId="scheduled"
            errors={errors}
            register={register}
            registerOptions={{ required: 'Field is required' }}
            isRequired
            fontSize="sm"
          />

          <Button type="submit" width="120" colorScheme="orange" isLoading={loading || !!data} loadingText="Saving">
            Submit
          </Button>
        </form>
      </Card>
    </AppNavigation>
  )
}

export const getServerSideProps: GetServerSideProps = protect(async (context: GetServerSidePropsContext) => {
  // console.log(`context?.req?.headers`, context?.req?.headers)
  const pitchId = getSingleQueryParam(context.query, 'pitchId')
  const courseProductId = getSingleQueryParam(context.query, 'courseProductId')
  const ownerId = getSingleQueryParam(context.query, 'ownerId');

  if (!pitchId) {
    throw new Error('pitchId is required')
  }
  if (!courseProductId) {
    throw new Error('courseProductId is required')
  }
  if (!ownerId) {
    throw new Error('ownerId is required')
  }

  const props = {
    pitchId,
    courseProductId,
    ownerId
  }
  // console.log(`props`, props)

  return { props }
})
