import { gql } from '@apollo/client'
import { PitchMeetingFeedback, User } from '@binding'
import { AppNavigation, FilterColumn, MainContent } from '@components'
import { FilterBar, FilterBarConfig } from '@components/FilterBar'
import { AdminPitchMeetingFeedbackTable } from '@components/modules/pitches'
import { initializeApollo } from '@core/apollo-client'
import { protect } from '@core/server'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React, {useEffect, useState} from 'react'
import { processApolloError } from '../../../core/apollo'

type AdminMeetingFeedbackPageProps = {
  pitchMeetingFeedbacks?: PitchMeetingFeedback[]
  users: User[]
  errors?: string
}

const filterBarConfig: FilterBarConfig = [
  {
    label: 'Status',
    filter: 'status_eq',
    type: 'SELECT',
    code: 'status',
    options: [
      {
        label: 'Requested',
        value: 'REQUESTED',
      },
      {
        label: 'Assigned',
        value: 'ASSIGNED',
      },
      {
        label: 'Complete',
        value: 'COMPLETE',
      },
    ],
  },
]

export default function AdminMeetingFeedbackPage({
  pitchMeetingFeedbacks,
  users,
  errors,
}: AdminMeetingFeedbackPageProps) {
  // console.log('pitchMeetingFeedbacks :>> ', pitchMeetingFeedbacks)
  // console.log('users :>> ', users)
  const [loading, setLoading] = useState(true);

  if (errors) {
    return <div>Errors: {errors}</div>
  }

  if (!pitchMeetingFeedbacks) {
    return <div>empty payload: {pitchMeetingFeedbacks}</div>
  }
  
  const loaderTimeout = () => {
    setTimeout(()=> {
      setLoading(false);
    },250)
  }

  useEffect(() => {
    loaderTimeout();
  }, [])

  return (
    <AppNavigation isLoading={loading}>
      <FilterColumn>
        <FilterBar items={filterBarConfig} />
      </FilterColumn>

      <MainContent className="w-full ml-4 mt-4">
        <AdminPitchMeetingFeedbackTable users={users} pitchMeetingFeedbacks={pitchMeetingFeedbacks} />
      </MainContent>
    </AppNavigation>
  )
}

const LIST_QUERY = gql`
  query AdminMeetingFeedbackPageQuery($where: PitchMeetingFeedbackWhereInput, $limit: Int) {
    users(where: { capabilities_containsAny: ["REVIEWER", "ADMIN"] }) {
      id
      name
      profilePictureFile {
        id
        url
      }
    }
    pitchMeetingFeedbacks(where: $where, limit: $limit, orderBy: createdAt_DESC) {
      id
      status
      reviewer {
        id
        name
      }
      reviewerNotes
      recordingFileId
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

export const getServerSideProps: GetServerSideProps = protect(async (context: GetServerSidePropsContext) => {
  const client = initializeApollo({ headers: context?.req?.headers })
  // console.log(`context.query`, context.query)

  // Build where filter from query string.  Use white list and remove items that are empty
  const where = { ...context.query }
  Object.keys(where).forEach((key: string) => {
    if (['status_eq'].indexOf(key) < 0 || !where[key]) {
      delete where[key]
    }
  })

  // console.log(`where`, where)

  try {
    const payload = await client.query({
      query: LIST_QUERY,
      variables: {
        limit: 20,
        where,
      },
    })

    // console.log('payload :>> ', JSON.stringify(payload, undefined, 2))

    const result = {
      props: payload.data,
    }
    // addApolloState(client, result)
    return result
  } catch (error) {
    // console.log('ERROR ON PITCH INDEX PAGE')
    const errors = processApolloError(error)
    return { props: { errors: JSON.stringify(errors) } }
  }
})
