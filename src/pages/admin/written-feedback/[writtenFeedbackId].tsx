import { gql } from '@apollo/client'
import { PitchWrittenFeedback } from '@binding'
import { Center, Flex } from '@chakra-ui/react'
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
}

export default function AdminWrittenFeedbackDetailPage({ pitchWrittenFeedback }: AdminWrittenFeedbackDetailPageProps) {
  // console.log('AdminWrittenFeedbackDetailPage perk :>> ', perk)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const onSuccess = (data: any) => {
    return router.push('/admin/written-feedback/')
  }

  return (
    <AppNavigation isLoading={isLoading}>
      <Head>
        <title>Written Feedback</title>
      </Head>

      <Flex className="flex-col items-start w-full">
        {/* <Box className="mx-4 py-4">
          <Breadcrumb spacing="8px" separator={<BsChevronRight color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <BiHome />
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/written-feedback">Written Feedback List</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href={router.pathname}>Written Feedback</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box> */}

        <Center className="w-full mt-8">
          <FormPanel className="w-128">
            {pitchWrittenFeedback.status === 'REQUESTED' && 'Go back to the list endpoint and assign a reviewer'}

            {pitchWrittenFeedback.status === 'ASSIGNED' && (
              <AdminWrittenFeedbackForm pitchWrittenFeedback={pitchWrittenFeedback} onSuccess={onSuccess} />
            )}
            {pitchWrittenFeedback.status === 'COMPLETE' && (
              <AdminWrittenFeedbackForm pitchWrittenFeedback={pitchWrittenFeedback} onSuccess={onSuccess} readonly />
            )}
          </FormPanel>
        </Center>
      </Flex>
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
    }
    // console.log(`props`, props)

    return { props }
  },
)
