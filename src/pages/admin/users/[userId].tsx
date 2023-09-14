import { User } from '@binding'
import { Center, Flex } from '@chakra-ui/react'
import { AppNavigation, FormPanel } from '@components'
import { AdminUserForm } from '@components/modules/users'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

type AdminMeetingFeedbackDetailPageProps = {
  user: User
}

export default function AdminMeetingFeedbackDetailPage({ user }: AdminMeetingFeedbackDetailPageProps) {
  const router = useRouter()

  const onSuccess = (data: any) => {
    return router.push('/admin/users/')
  }

  return (
    <AppNavigation>
      <Head>
        <title>Meeting Feedback</title>
      </Head>

      <Flex className="flex-col items-start w-full">
        <Center className="w-full mt-8">
          <FormPanel className="w-128">
            <AdminUserForm user={user} onSuccess={onSuccess} />
          </FormPanel>
        </Center>
      </Flex>
    </AppNavigation>
  )
}

// const FIND_ONE_QUERY = gql`
//   query AdminMeetingFeedbackSinglePageQuery($where: PitchMeetingFeedbackWhereUniqueInput!) {
//     pitchMeetingFeedback(where: $where) {
//       id
//       status
//       reviewer {
//         id
//         name
//       }
//       reviewerNotes
//       recordingFileId
//       recordingFile {
//         id
//         url
//       }
//       pitchId
//       pitch {
//         id
//         userId
//         user {
//           id
//           name
//           profilePictureFile {
//             id
//             url
//           }
//         }
//         createdAt
//         activePitchDeck {
//           id
//           status
//           pitchId
//           createdAt
//           file {
//             id
//             url
//           }
//         }
//       }
//       courseProductId
//       createdAt
//     }
//   }
// `

// export const getServerSideProps: GetServerSideProps = protect<AdminMeetingFeedbackDetailPageProps>(
//   async (context: GetServerSidePropsContext) => {
//     const client = initServerSideClient(context)

//     // console.log('context.query :>> ', context.query)
//     if (typeof context.query.meetingFeedbackId === 'undefined') {
//       // TODO: need a way to throw a standard error that the UI knows how to pick up and handle
//       throw 'NO ID'
//     }

//     const meetingFeedbackId = getSingleQueryParam(context.query, 'meetingFeedbackId')
//     const variables = {
//       where: {
//         id: meetingFeedbackId,
//       },
//     }
//     // console.log(`variables`, variables)

//     const payload = await client.query({
//       query: FIND_ONE_QUERY,
//       variables,
//     })
//     // console.log('Done Querying')

//     const props = {
//       pitchMeetingFeedback: payload.data.pitchMeetingFeedback,
//     }
//     // console.log(`props`, props)

//     return { props }
//   },
// )
