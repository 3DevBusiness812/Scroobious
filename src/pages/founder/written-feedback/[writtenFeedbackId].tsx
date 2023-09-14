import { gql } from '@apollo/client'
import { PitchWrittenFeedback } from '@binding'
import { Alert, Center, Flex } from '@chakra-ui/react'
import { AppNavigation, FormPanel } from '@components'
import { AdminWrittenFeedbackForm } from '@components/modules/pitches'
import { initServerSideClient } from '@core/apollo'
import { getSingleQueryParam } from '@core/querystring'
import { protect } from '@core/server'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

type AdminWrittenFeedbackDetailPageProps = {
  pitchWrittenFeedback: PitchWrittenFeedback
  reviewerAppBaseUrl: string
}

export default function AdminWrittenFeedbackDetailPage({
  pitchWrittenFeedback,
  reviewerAppBaseUrl,
}: AdminWrittenFeedbackDetailPageProps) {
  // console.log('AdminWrittenFeedbackDetailPage perk :>> ', perk)
  const router = useRouter()
  const [message] = useState(() => {
    if (pitchWrittenFeedback.status === 'REQUESTED') {
      return "We're currently assigning somebody to review your pitch!  You'll receive an email when we're done!"
    }

    if (pitchWrittenFeedback.status === 'ASSIGNED') {
      return "A reviewer is in the process of reviewing your pitch!  You'll receive an email when we're done!"
    }
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  return (
    <AppNavigation isLoading={isLoading}>
      <Head>
        <title>Written Feedback</title>
      </Head>

      {pitchWrittenFeedback.status === 'COMPLETE' && !pitchWrittenFeedback.reviewedPitchDeck?.file?.url ? (
        <div className="w-screen fixed left-0">
          <div className="w-full h-[calc(100vh-60px)] min-h-full max-h-full flex flex-col bg-gray-50">
            <iframe
              src={`${reviewerAppBaseUrl}/written-feedback/${pitchWrittenFeedback.id}`}
              allow="clipboard-write"
              className="m-0 p-0 flex-1"
            />
          </div>
        </div>
      ) : (
        <Flex className="flex-col items-start w-full">
          <Center className="w-full mt-8">
            <FormPanel className="w-128">
              {!!message && <Alert className="mb-4">{message}</Alert>}

              {pitchWrittenFeedback.status === 'COMPLETE' && <div />}

              <AdminWrittenFeedbackForm pitchWrittenFeedback={pitchWrittenFeedback} readonly />
            </FormPanel>
          </Center>
        </Flex>
      )}
    </AppNavigation>
  )
}

const FIND_ONE_QUERY = gql`
  query AdminWrittenFeedbackSinglePageQuery($where: PitchWrittenFeedbackWhereUniqueInput!) {
    pitchWrittenFeedback(where: $where) {
      id
      status
      reviewer {
        id
        name
      }
      reviewerNotes
      originalPitchDeckId
      originalPitchDeck {
        id
        file {
          id
          url
        }
      }
      reviewedPitchDeckId
      reviewedPitchDeck {
        id
        file {
          id
          url
        }
      }
      pitchId
      pitch {
        id
        userId
        user {
          id
          name
          profilePictureFile {
            id
            url
          }
        }
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
      courseProductId
      createdAt
    }
  }
`

export const getServerSideProps: GetServerSideProps = protect<AdminWrittenFeedbackDetailPageProps>(
  async (context: GetServerSidePropsContext) => {
    const client = initServerSideClient(context)

    // console.log('context.query :>> ', context.query)
    if (typeof context.query.writtenFeedbackId === 'undefined') {
      // TODO: need a way to throw a standard error that the UI knows how to pick up and handle
      throw 'NO ID'
    }

    const writtenFeedbackId = getSingleQueryParam(context.query, 'writtenFeedbackId')
    const variables = {
      where: {
        id: writtenFeedbackId,
      },
    }
    // console.log(`variables`, variables)

    const payload = await client.query({
      query: FIND_ONE_QUERY,
      variables,
    })
    // console.log('Done Querying')

    const props = {
      pitchWrittenFeedback: payload.data.pitchWrittenFeedback,
      reviewerAppBaseUrl: process.env.V2_BASE_URL!,
    }
    // console.log(`props`, props)

    return { props }
  },
)
