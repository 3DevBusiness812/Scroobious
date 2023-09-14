import { gql } from '@apollo/client'
import { PitchMeetingFeedback } from '@binding'
import { Alert, Center, Flex } from '@chakra-ui/react'
import { AppNavigation, FormPanel } from '@components'
import { AdminMeetingFeedbackForm } from '@components/modules/pitches'
import { initServerSideClient } from '@core/apollo'
import { getSingleQueryParam } from '@core/querystring'
import { protect } from '@core/server'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

type AdminMeetingFeedbackDetailPageProps = {
  pitchMeetingFeedback: PitchMeetingFeedback
}

export default function AdminMeetingFeedbackDetailPage({ pitchMeetingFeedback }: AdminMeetingFeedbackDetailPageProps) {
  // console.log('AdminMeetingFeedbackDetailPage perk :>> ', perk)
  const [message] = useState(() => {
    if (pitchMeetingFeedback.status === 'REQUESTED') {
      return "Thanks for signing up for a 1:1 review. We're currently assigning somebody to meet with you!"
    }

    if (pitchMeetingFeedback.status === 'ASSIGNED') {
      return "You're all set.  We'll see you at the 1:1 review."
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
        <title>Meeting Feedback</title>
      </Head>

      <Flex className="flex-col items-start w-full">
        {/* <Box className="mx-4 py-4">
          <Breadcrumb spacing="8px" separator={<BsChevronRight color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <BiHome />
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href={router.pathname}>Meeting Feedback</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box> */}

        <Center className="w-full mt-8">
          <FormPanel className="w-128">
            {!!message && <Alert className="mb-4">{message}</Alert>}

            {/* {pitchMeetingFeedback.status === 'COMPLETE' && <div />} */}
            <AdminMeetingFeedbackForm pitchMeetingFeedback={pitchMeetingFeedback} readonly />
          </FormPanel>
        </Center>
      </Flex>
    </AppNavigation>
  )
}

const FIND_ONE_QUERY = gql`
  query AdminMeetingFeedbackSinglePageQuery($where: PitchMeetingFeedbackWhereUniqueInput!) {
    pitchMeetingFeedback(where: $where) {
      id
      status
      reviewer {
        id
        name
      }
      recordingFile {
        id
        url
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

export const getServerSideProps: GetServerSideProps = protect<AdminMeetingFeedbackDetailPageProps>(
  async (context: GetServerSidePropsContext) => {
    const client = initServerSideClient(context)

    // console.log('context.query :>> ', context.query)
    if (typeof context.query.meetingFeedbackId === 'undefined') {
      // TODO: need a way to throw a standard error that the UI knows how to pick up and handle
      throw 'NO ID'
    }

    const meetingFeedbackId = getSingleQueryParam(context.query, 'meetingFeedbackId')
    const variables = {
      where: {
        id: meetingFeedbackId,
      },
    }
    // console.log('variables', variables)

    const payload = await client.query({
      query: FIND_ONE_QUERY,
      variables,
    })
    // console.log('Done Querying')

    const props = {
      pitchMeetingFeedback: payload.data.pitchMeetingFeedback,
    }
    // console.log('props', props)

    return { props }
  },
)
