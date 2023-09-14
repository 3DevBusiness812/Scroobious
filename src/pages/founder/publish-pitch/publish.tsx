import { gql } from '@apollo/client'
import { Pitch, PitchWhereUniqueInput, PitchDeckWhereUniqueInput } from '@binding'
import { HStack, VStack, Flex, FormControl, FormLabel, Switch } from '@chakra-ui/react'
import { AppNavigation, Card } from '@components'
import { initServerSideClient } from '@core/apollo'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { FounderProfilePreview } from '@components/modules/founder'
import { callAPI, handleApolloMutation } from '@core/request'
import cn from 'classnames'
import { useAlert } from '@core/alert.provider'

type Props = {
  pitch: Pitch
  errors?: string
  ownerId?: string
}

export default function MyPublishPitchPage({ pitch, ownerId, errors }: Props) {
  const router = useRouter()
  const { setAlert } = useAlert()
  const [publishProfile, setPublishProfile] = useState(pitch?.status !== 'PUBLISHED')

  if (errors) {
    return <div>Errors: {JSON.stringify(errors)}</div>
  }

  if (!pitch) {
    return <div>Not Found</div>
  }

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const handlePublishProfile = async () => {
    setAlert({ isHide: true })

    const showErrorAlert = (message: string) => {
      setAlert({
        type: 'notification',
        message,
        status: 'error',
        timeout: 15000,
      })
    }

    if (publishProfile && !pitch?.latestPitchDeck?.id) {
      showErrorAlert('You must upload a pitch deck before you can publish your pitch')
      return false
    }

    if (publishProfile && !pitch?.latestPitchDeck?.isCategorized) {
      showErrorAlert('You must categorize your pitch deck before you can publish your pitch')
      return false
    }

    if (publishProfile && (!pitch?.activePitchVideo?.id || pitch?.activePitchVideo?.status !== 'ACTIVE')) {
      showErrorAlert('You must upload a 1 min video before you can publish your pitch')
      return false
    }

    if (pitch?.latestPitchDeck?.id) {
      await handleApolloMutation(
        updatePitchDeck(
          { status: publishProfile ? 'ACTIVE' : 'INACTIVE', draft: !publishProfile },
          { id: pitch.latestPitchDeck.id },
        ),
      )
    }

    const result = await handleApolloMutation(
      publishProfile ? publishPitch({ id: pitch.id }) : unpublishPitch({ id: pitch.id }),
    )

    if (!result.errors) {
      return true
      // Success
    }

    return false
  }

  return (
    <AppNavigation>
      <Head>
        <title>Publish Profile to Investors</title>
      </Head>
      <Card className="mb-4 flex-1 mr-4">
        <VStack className="mt-5">
          <HStack width="100%" justifyContent="right" py={4}>
            <FormControl display="flex" alignItems="right" justifyContent="flex-end">
              <FormLabel htmlFor="publish-toggle" mb="0">
                Publish my pitch to the Scroobious Investor Portal
              </FormLabel>
              <Switch
                id="publish-toggle"
                size="lg"
                colorScheme="orange"
                isChecked={!publishProfile}
                onChange={async () => {
                  if (await handlePublishProfile()) {
                    setPublishProfile(!publishProfile)
                  }
                }}
              />
            </FormControl>
          </HStack>
        </VStack>
        <VStack className="my-5 mx-10">
          <Flex
            width="100%"
            justifyContent="left"
            alignItems="center"
            fontWeight="bold"
            className={cn(
              'rounded-md border-2 px-10 py-5',
              publishProfile ? 'bg-yellow-400/25 border-yellow-400/50 ' : 'bg-green-400/25 border-green-400/50 ',
            )}
          >
            {publishProfile
              ? 'Your pitch is not currently published to the Investor Portal. To publish your pitch, simply toggle the switch above.'
              : 'Your pitch is now published to the Investor Portal.'}
          </Flex>
        </VStack>
        <FounderProfilePreview pitch={pitch} onSave={() => refreshData()} />
      </Card>
    </AppNavigation>
  )
}

export async function publishPitch(where: PitchWhereUniqueInput) {
  return callAPI<any>({
    variables: { where },
    query: `
      mutation ($where: PitchWhereUniqueInput!) {
        publishPitch(where: $where) {
          id
        }
      }
    `,
    operationName: 'publishPitch',
  })
}

export async function unpublishPitch(where: PitchWhereUniqueInput) {
  return callAPI<any>({
    variables: { where },
    query: `
      mutation ($where: PitchWhereUniqueInput!) {
        unpublishPitch(where: $where) {
          id
        }
      }
    `,
    operationName: 'unpublishPitch',
  })
}

export async function updatePitchDeck(data: { status: string; draft: boolean }, where: PitchDeckWhereUniqueInput) {
  return callAPI<any>({
    variables: { data, where },
    query: `
      mutation ($data: PitchDeckUpdateInput!, $where: PitchDeckWhereUniqueInput!) {
        updatePitchDeck(data: $data, where: $where) {
          id
        }
      }
    `,
    operationName: 'updatePitchDeck',
  })
}

const PITCH_DETAIL_QUERY = gql`
  query PitchDetailQuery($pitchWhere: PitchWhereUniqueInput!, $pitchUserStatusWhere: PitchUserStatusWhereUniqueInput!) {
    pitch(where: $pitchWhere) {
      id
      views
      bookmarks
      listStatus
      status
      createdAt
      shortDescription
      presentationStatus
      deckComfortLevel
      presentationComfortLevel
      latestPitchDeck {
        id
        isCategorized
        file {
          url
        }
        status
      }
      activePitchVideo {
        id
        status
        video {
          id
          wistiaUrl
          file {
            url
          }
        }
      }
      extendedPitchVideo {
        video {
          id
          wistiaUrl
          file {
            url
          }
        }
      }
      user {
        id
        name
        founderProfile {
          id
          twitterUrl
          linkedinUrl
        }
        profilePictureFile {
          id
          url
        }
      }
      organization {
        startup {
          id
          industries
          fundraiseStatus
          stateProvince
          companyStage
          revenue
          name
          shortDescription
          tinyDescription
          originStory
          website
          corporateStructure
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
      comments {
        id
        body
        visibility
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
      course {
        id
        courseProducts {
          id
          courseId
          productId
          status
          objectId
          product {
            id
            name
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

const PITCH_LIST_QUERY = gql`
  query PitchListQuery($where: PitchQueryInput, $limit: Int) {
    pitches(where: $where, limit: $limit) {
      id
    }
  }
`

export type PitchListQuery = any // TODO: codegen
export type PitchDetailQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    const client = initServerSideClient(context)

    let pitchId
    let payload

    try {
      payload = await client.query<PitchListQuery>({
        query: PITCH_LIST_QUERY,
        variables: {
          limit: 20,
        },
      })

      if (!payload.data.pitches.length) {
        return {
          redirect: {
            destination: '/founder/pitches/new',
            permanent: false,
          },
        }
      }

      pitchId = payload.data.pitches[0].id

      const variables = {
        pitchWhere: {
          id: pitchId,
        },
        pitchUserStatusWhere: {
          pitchId,
          userId: session.user.id,
        },
      }

      payload = await client.query<PitchDetailQuery>({
        query: PITCH_DETAIL_QUERY,
        variables,
      })
    } catch (error) {
      console.log('error!!!!!', error)
      throw error
    }

    const props = {
      pitch: JSON.parse(JSON.stringify(payload.data.pitch)) as Pitch,
      ownerId: JSON.parse(JSON.stringify(payload.data.pitch.user.id)),
    }

    return { props }
  },
)
