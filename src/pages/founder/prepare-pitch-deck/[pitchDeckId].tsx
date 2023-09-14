import { gql } from '@apollo/client'
import { PitchWrittenFeedback } from '@binding'
import { AppNavigation } from '@components'
import { ScroobiousSession } from '@core/types'
import { initServerSideClient } from '@core/apollo'
import { getSingleQueryParam } from '@core/querystring'
import { protect } from '@core/server'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

type PreparePitchDeckPageProps = {
  pitchDeckId: string
  reviewerAppBaseUrl: string
}

export default function PreparePitchDeckPage({ pitchDeckId, reviewerAppBaseUrl }: PreparePitchDeckPageProps) {
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
        <title>Prepare Pitch Deck</title>
      </Head>

      <div className="w-screen fixed left-0">
        <div className="w-full h-[calc(100vh-60px)] min-h-full max-h-full flex flex-col bg-gray-50">
          <iframe
            src={`${reviewerAppBaseUrl}/prepare-pitch-deck/${pitchDeckId}`}
            className="m-0 p-0 flex-1"
            allow="fullscreen"
          />
        </div>
      </div>
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

export const getServerSideProps: GetServerSideProps = protect<PreparePitchDeckPageProps>(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    if (typeof context.query.pitchDeckId === 'undefined') {
      throw 'NO ID'
    }

    const pitchDeckId = getSingleQueryParam(context.query, 'pitchDeckId')

    return {
      props: {
        pitchDeckId: pitchDeckId!,
        reviewerAppBaseUrl: process.env.V2_BASE_URL!,
      },
    }
  },
)
