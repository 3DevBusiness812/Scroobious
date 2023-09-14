import { gql } from '@apollo/client'
import { Pitch, PitchComment, PitchUserStatus } from '@binding'
import { ChatIcon } from '@chakra-ui/icons'
import { Box, HStack, Spacer, Text } from '@chakra-ui/react'
import { AppNavigation, LinkButton } from '@components'
import { PitchBookmarkButton, PitchIgnoreButton } from '@components/modules/pitches'
import { initServerSideClient } from '@core/apollo'
import { useCodeList } from '@core/code-list.provider'
import { getSingleQueryParam } from '@core/querystring'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React, { useCallback, useState } from 'react'
import { FounderProfilePreview } from '@components/modules/founder'
import { authV2AndRedirect } from '@src/auth/auth-v2'
import { getSessionTokenFromRequest } from '@core/cookie'

type Props = {
  pitch?: Pitch
  pitchUserStatus?: PitchUserStatus
  errors?: string
  appV2AuthParams: {
    appV2BaseUrl: string
    token: string
  }
}

export default function PitchPage({ pitch, errors, pitchUserStatus, appV2AuthParams }: Props) {
  const [listStatus, updateListStatus] = useState(pitchUserStatus?.listStatus as unknown as string)
  const [{ data }] = useCodeList()

  const handleUserStatusUpdate = useCallback(
    (newStatus: string) => {
      if (['IGNORE', 'BOOKMARK'].includes(newStatus)) {
        authV2AndRedirect({
          ...appV2AuthParams,
          redirectSlug: `/investor/pitch-feedback/${pitch?.id}`,
        })
      }
      updateListStatus(newStatus)
    },
    [listStatus],
  )

  const handleViewPitchDeck = () => {
    authV2AndRedirect({
      ...appV2AuthParams,
      redirectSlug: `/pitch-deck-messenger/${pitch?.activePitchDeck?.id}`,
    })
  }

  const onCommentCreate = (newComment: PitchComment) => {
    // console.log('COMMENT', newComment)
  }

  if (!data) {
    return <div />
  }

  if (errors) {
    return <div>Errors: {JSON.stringify(errors)}</div>
  }

  if (!pitch || !pitch.activePitchDeck) {
    return <div>Not Found</div>
  }

  return (
    <AppNavigation>
      <Box>
        <HStack className="mx-0 py-6" width="100%" justifyContent="flex-start">
          <HStack>
            <Text fontSize="lg" fontWeight="medium" className="pt-2 ml-0"> <a href="/investor/pitches/recommended">All Pitches</a> / </Text>
            /
            <Text fontSize="lg" fontWeight="bold" className="pt-2 ml-10">
              {pitch.organization.startup.name}
            </Text>
          </HStack>
          <Spacer />
          <Box>
            <LinkButton
              href={`/messages?recipientId=${pitch.user.id}`}
              buttonProps={{
                mr: '3',
                variant: 'outline',
                bgColor: 'white',
                textColor: 'primary.400',
                leftIcon: <ChatIcon textColor="black" className="w-6" />,
              }}
            >
              Contact Founder
            </LinkButton>

            <PitchIgnoreButton
              className="bg-white"
              listStatus={listStatus}
              pitchId={pitch.id}
              onClick={handleUserStatusUpdate}
            />
            <PitchBookmarkButton
              className="bg-white"
              listStatus={listStatus}
              pitchId={pitch.id}
              onClick={handleUserStatusUpdate}
            />
          </Box>
        </HStack>

        <FounderProfilePreview pitch={pitch} onViewPitchDeck={handleViewPitchDeck} />
      </Box>
    </AppNavigation>
  )
}

const PITCH_DETAIL_QUERY = gql`
  query PitchDetailQuery($pitchWhere: PitchWhereUniqueInput!, $pitchUserStatusWhere: PitchUserStatusWhereUniqueInput!) {
    pitch(where: $pitchWhere) {
      id
      views
      bookmarks
      listStatus
      createdAt
      activePitchDeck {
        id
        file {
          url
        }
      }
      activePitchVideo {
        video {
          wistiaUrl
          file {
            url
          }
        }
      }
      extendedPitchVideo {
        video {
          wistiaUrl
          file {
            url
          }
        }
      }
      user {
        id
        name
        profilePictureFile {
          id
          url
        }

        founderProfile {
          id
          twitterUrl
          linkedinUrl
        }
      }
      organization {
        startup {
          industries
          fundraiseStatus
          stateProvince
          companyStage
          revenue
          name
          shortDescription
          tinyDescription
          originStory
          corporateStructure
          website
        }
      }
      updates {
        id
        body
        createdAt
        createdBy {
          id
          name
          profilePictureFile {
            id
            url
          }
        }
      }
    }

    pitchUserStatus(where: $pitchUserStatusWhere) {
      userId
      pitchId
      listStatus
      watchStatus
    }
  }
`

export type PitchDetailQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    // console.log(`context?.req?.headers`, context?.req?.headers)
    const client = initServerSideClient(context)

    if (typeof context.query.pitchId === 'undefined') {
      // TODO: need a way to throw a standard error that the UI knows how to pick up and handle
      throw 'NO ID'
    }

    const pitchId = getSingleQueryParam(context.query, 'pitchId')
    const variables = {
      pitchWhere: {
        id: pitchId,
      },
      pitchUserStatusWhere: {
        pitchId,
        userId: session.user.id,
      },
    }
    // console.log(`variables`, variables)

    // console.log('Querying')
    let payload
    try {
      payload = await client.query<PitchDetailQuery>({
        query: PITCH_DETAIL_QUERY,
        variables,
      })
      // console.log('Done Querying')
    } catch (error) {
      // console.log('error!!!!!', error)
      throw error
    }

    // console.log(`payload`, payload)
    // console.log(`payload.data.pitch.user`, payload.data.pitch.user)

    const props = {
      pitch: JSON.parse(JSON.stringify(payload.data.pitch)),
      pitchUserStatus: payload.data.pitchUserStatus,
      appV2AuthParams: {
        appV2BaseUrl: process.env.V2_BASE_URL,
        token: getSessionTokenFromRequest(context.req),
      },
    }
    // console.log(`props`, props)

    return { props }
  },
)
