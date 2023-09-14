import { gql } from '@apollo/client'
import { Pitch, PitchWrittenFeedback } from '@binding'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { AppNavigation, Card, Header, PDFViewer } from '@components'
import {
  PitchFeedback,
  PitchDeckUploadAndPreview,
  PitchVideoUploadAndPreview,
  PitchDeckCategorizeSlides,
} from '@components/modules/pitches'
import { initServerSideClient } from '@core/apollo'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { FaUpload, FaRegClone } from 'react-icons/fa'
import { RiFileEditLine } from 'react-icons/ri'
import { BsListTask } from 'react-icons/bs'
import { useRouter } from 'next/router'
import { InvestorCard } from '@components/modules/pitches/InvestorCard'
import ReactPlayer from 'react-player'
import { authV2AndRedirect } from '@src/auth/auth-v2'
import { getSessionTokenFromRequest } from '@core/cookie'

type Props = {
  pitch: Pitch
  writtenFeedbackCheckoutUrl: string
  errors?: string
  ownerId?: string
  pitchWrittenFeedbacks?: PitchWrittenFeedback[]
  appV2AuthParams: {
    appV2BaseUrl: string
    token: string
  }
}

const iconClasses = 'float-left mr-3 mt-1'

const leftNav = [
  {
    id: 'manage-pitch',
    name: 'Pitch Deck',
    icon: <RiFileEditLine className={iconClasses} />,
    items: [
      {
        id: 'upload-pitch-deck',
        name: 'Upload Pitch Deck',
        icon: <FaUpload className={iconClasses} />,
      },
      {
        id: 'categorize-slides',
        name: 'Categorize Slides',
        icon: <FaRegClone className={iconClasses} />,
      },
      {
        id: 'pitch-deck-feedback',
        name: 'Get Feedback',
        icon: <BsListTask className={iconClasses} />,
      },
    ],
  },
  {
    id: 'manage-video',
    name: 'Pitch Video',
    icon: <RiFileEditLine className={iconClasses} />,
    items: [
      {
        id: 'upload-pitch-short-video',
        name: 'Upload 1 Minute Pitch Video',
        icon: <FaUpload className={iconClasses} />,
      },
      {
        id: 'upload-pitch-extended-video',
        name: 'Upload 5 Minute Pitch Video',
        icon: <FaUpload className={iconClasses} />,
      },
    ],
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    icon: <RiFileEditLine className={iconClasses} />,
    items: [
      {
        id: 'ai-automated-review',
        name: 'Automated Review',
        icon: <BsListTask className={iconClasses} />,
      },
    ],
  },
]

const findPageById = (pageId?: any) => {
  let pageSubIndex = -1

  const sectionIndex = leftNav.findIndex((sectionEntry) => {
    pageSubIndex = sectionEntry.items.findIndex((item) => item.id === pageId)
    return pageSubIndex > -1
  })

  return {
    currentIndex: sectionIndex > -1 ? sectionIndex : 0,
    currentSubIndex: pageSubIndex > -1 ? pageSubIndex : 0,
  }
}

const getTitleForPage = (pageId?: any) => {
  const { currentIndex, currentSubIndex } = findPageById(pageId)

  return `Craft Pitch - ${leftNav[currentIndex].items[currentSubIndex].name}`
}

export default function MyPitchPage({
  pitch,
  ownerId,
  writtenFeedbackCheckoutUrl,
  errors,
  pitchWrittenFeedbacks,
  appV2AuthParams,
}: Props) {
  const router = useRouter()
  const [state, setState] = useState(() => ({
    leftNav: {
      ...findPageById(router.query.pageId),
    },
  }))
  const [title, setTitle] = useState(getTitleForPage(router.query.pageId))
  const [publishedDeckUpdated, setPublishedDeckUpdated] = useState(false)

  const currentPageId = leftNav[state.leftNav.currentIndex].items[state.leftNav.currentSubIndex].id

  useEffect(() => {
    setTitle(getTitleForPage(currentPageId))

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          pageId: currentPageId,
        },
      },
      undefined,
      { shallow: true },
    )
  }, [currentPageId])

  if (errors) {
    return <div>Errors: {JSON.stringify(errors)}</div>
  }

  if (!pitch) {
    return <div>Not Found</div>
  }

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const setLeftNav = (currentIndex: number, currentSubIndex: number) => {
    setState({
      ...state,
      leftNav: {
        ...leftNav,
        currentIndex,
        currentSubIndex,
      },
    })
  }

  const setLeftNavByPageId = (uploadType?: string) => {
    const { currentIndex, currentSubIndex } = findPageById(uploadType)
    setLeftNav(currentIndex, currentSubIndex)
  }

  const renderPage = () => {
    const pitchPublished = pitch.status === 'PUBLISHED'

    switch (currentPageId) {
      case 'upload-pitch-deck':
        return (
          <VStack className="mr-4">
            {publishedDeckUpdated && (
              <Box
                width="100%"
                justifyContent="left"
                fontWeight="bold"
                className="rounded-md border-2 px-10 py-5 bg-yellow-400/25 border-yellow-400/50"
              >
                Your latest pith deck has not been published to the Investor Portal. Be sure to{' '}
                <a href="/founder/pitches/categorize-slides" className="underline">
                  categorize
                </a>{' '}
                your slides and re-publish your pitch to activate the new deck.
              </Box>
            )}
            <Card className="mb-4 flex-1 mr-4">
              <PitchDeckUploadAndPreview
                pitch={pitch}
                onUpload={() => {
                  if (pitch.status === 'PUBLISHED') {
                    setPublishedDeckUpdated(true)
                  } else {
                    router.push({ pathname: '/founder/pitches/categorize-slides' })
                    refreshData()
                    setLeftNavByPageId('categorize-slides')
                  }
                }}
              />
            </Card>
          </VStack>
        )

      case 'categorize-slides':
        return (
          <Card className="mb-4 flex-1 mr-4">
            <PitchDeckCategorizeSlides
              pitch={pitch}
              onUpload={() => refreshData()}
              nextLabel="Next, Categorize Your Slides"
              onNextClick={() => {
                if (pitch.latestPitchDeck?.id) {
                  router.push(`/founder/prepare-pitch-deck/${pitch.latestPitchDeck.id}`)
                }
              }}
            />
          </Card>
        )

      case 'pitch-deck-feedback':
        return (
          <Card className="mb-4 flex-1 mr-4">
            <PitchFeedback
              pitch={pitch}
              courseProducts={pitch.course?.courseProducts}
              ownerId={ownerId}
              writtenFeedbackCheckoutUrl={writtenFeedbackCheckoutUrl}
              gotoUploadPitchDeck={() => {
                setLeftNavByPageId('upload-pitch-deck')
              }}
              gotoCategorizeSlides={() => {
                if (pitch.latestPitchDeck?.id) {
                  router.push(`/founder/prepare-pitch-deck/${pitch.latestPitchDeck.id}`)
                }
              }}
              pitchWrittenFeedbacks={pitchWrittenFeedbacks}
            />
          </Card>
        )

      case 'upload-pitch-short-video':
        return (
          <PitchVideoUploadAndPreview
            key="short-video"
            pitch={pitch}
            onUpload={() => refreshData()}
            onDelete={() => refreshData()}
            nextLabel={!pitchPublished ? 'Next: Get a Review by our AI Assistant' : undefined}
            onNextClick={
              !pitchPublished
                ? () => {
                    router.push('/founder/pitches/ai-automated-review')
                    setLeftNavByPageId('ai-automated-review')
                  }
                : undefined
            }
          />
        )

      case 'upload-pitch-extended-video':
        return (
          <PitchVideoUploadAndPreview
            key="extended-video"
            pitch={pitch}
            extendedVideo
            onUpload={() => refreshData()}
            onDelete={() => refreshData()}
            nextLabel={!pitchPublished ? 'Next: Get a Review by our AI Assistant' : undefined}
            onNextClick={
              !pitchPublished
                ? () => {
                    router.push('/founder/pitches/ai-automated-review')
                    setLeftNavByPageId('ai-automated-review')
                  }
                : undefined
            }
          />
        )

      case 'ai-automated-review':
        return (
          <Card className="mb-4 flex-1 mr-4">
            <Box bgColor="whiteAlpha.900" width="100%">
              <Box>
                <Header title="Improve your chances of getting noticed using Pipstant, your AI Assistant" />
              </Box>
              <HStack>
                <Box className="px-4">
                  <InvestorCard
                    key={pitch.id}
                    pitch={pitch}
                    headerContent={
                      <Box flex={1}>
                        <div className="w-full">
                          {pitch.activePitchVideo?.video?.wistiaUrl && (
                            <ReactPlayer width="280px" height="160px" url={pitch.activePitchVideo?.video?.wistiaUrl} />
                          )}
                          {!pitch.activePitchVideo?.video?.wistiaUrl && pitch.activePitchDeck && (
                            <Box className="max-h-48 mb-2" height="160px">
                              <PDFViewer url={pitch.activePitchDeck.file.url} height={160} />
                            </Box>
                          )}
                        </div>
                      </Box>
                    }
                    layout="vertical"
                    footerContent={<></>}
                    cardWidth={280}
                    disabled
                  />
                </Box>
                <Box className="px-4">
                  <div className="flex-1 space-y-6">
                    <p>
                      Introducing <b>Pipstant, the Scroobious AI Assistant</b>. This is a premium service included with
                      your subscription which will automatically analyze your video, pitch deck, and company information
                      to automatically suggest the most concise description of your company.
                    </p>
                    <p>
                      The card on the left shows how investors will see your pitch in the list of recommendations.
                      Investors, like all people, tend to judge a book by its cover. If an investor cannot understand
                      what your company does by reading the description, or if the words get cut off - they typically
                      won&apos;t look deeper. A short and concise description can help you get noticed.
                    </p>
                    <p>
                      We also know how difficult it is to condense your pitch to a sentence. That&apos;s why we created
                      Pipstant, who will help you craft a description that makes investors want to click.
                    </p>

                    <Button
                      p={4}
                      mt={2}
                      size="sm"
                      width="100%"
                      colorScheme="orange"
                      onClick={() => {
                        authV2AndRedirect({
                          ...appV2AuthParams,
                          redirectSlug: '/founder/assistant',
                        })
                      }}
                      border="2px"
                      borderColor="gray.200"
                      fontWeight="normal"
                    >
                      Next: Try the AI Assistant
                    </Button>
                  </div>
                </Box>
              </HStack>
            </Box>
          </Card>
        )

      default: {
        setLeftNavByPageId()
        return <Box />
      }
    }
  }

  return (
    <AppNavigation>
      <Head>
        <title>{title}</title>
      </Head>
      <VStack flex={1} width="100%" justifyContent="flex-start" px={4}>
        <HStack flex={1} justifyContent="flex-start" alignItems="flex-start" width="100%" mt={4}>
          <Box boxShadow="base" bgColor="white" height="100%" className="mr-2">
            <VStack spacing={4} justifyContent="space-evenly">
              <Box width="300px">
                <Accordion defaultIndex={state.leftNav.currentIndex} index={state.leftNav.currentIndex}>
                  {leftNav.map((leftNavEntry, leftNavEntryIndex) => (
                    <AccordionItem key={leftNavEntry.id}>
                      <AccordionButton
                        bgColor="gray.600"
                        className="text-white"
                        _expanded={{ bgColor: 'orange.500' }}
                        _hover={{ bgColor: 'orange.500' }}
                        onClick={() => {
                          setLeftNav(
                            leftNavEntryIndex,
                            leftNavEntryIndex === state.leftNav.currentIndex ? state.leftNav.currentSubIndex : 0,
                          )
                        }}
                      >
                        <Box key="manage-pitch-box" flex="1" textAlign="left">
                          {leftNavEntry.icon}
                          {leftNavEntry.name}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel>
                        {leftNavEntry.items.map((leftNavItemsEntry, leftNavItemsEntryIndex) => {
                          const isCurrentItem = leftNavItemsEntryIndex === state.leftNav.currentSubIndex
                          const textColor = isCurrentItem ? 'green.400' : 'black'
                          return (
                            <Box
                              p={1}
                              color={textColor}
                              className={cn('my-1', { 'bg-gray-100': isCurrentItem })}
                              key={leftNavItemsEntry.id}
                            >
                              <HStack
                                className="cursor-pointer"
                                onClick={() => {
                                  setLeftNav(leftNavEntryIndex, leftNavItemsEntryIndex)
                                }}
                              >
                                <Box flexShrink={1}>{leftNavItemsEntry.icon}</Box>
                                <Text flexGrow={1}>{leftNavItemsEntry.name}</Text>
                              </HStack>
                            </Box>
                          )
                        })}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Box>
            </VStack>
          </Box>
          {renderPage()}
        </HStack>
      </VStack>
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
        video {
          wistiaUrl
          file {
            url
          }
        }
        id
      }
      extendedPitchVideo {
        video {
          wistiaUrl
          file {
            url
          }
        }
        id
      }
      user {
        id
        name
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
          # image
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
          createdAt
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

const PITCH_WRITTEN_FEEDBACK_LIST_QUERY = gql`
  query PitchWrittenFeedbackQuery($where: PitchWrittenFeedbackWhereInput, $limit: Int) {
    pitchWrittenFeedbacks(where: $where, limit: $limit) {
      id
      status
      ownerId
      originalPitchDeckId
      reviewer {
        id
        name
      }
    }
  }
`

export type PitchListQuery = any // TODO: codegen
export type PitchDetailQuery = any // TODO: codegen
export type PitchWrittenFeedbackQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    const client = initServerSideClient(context)

    let pitchId
    let payload
    let pitchWrittenFeedbackPayload

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

      const pitchWrittenFeedbackVariables = {
        pitchWrittenFeedbackWhere: {
          pitchId,
        },
      }

      pitchWrittenFeedbackPayload = await client.query<PitchWrittenFeedbackQuery>({
        query: PITCH_WRITTEN_FEEDBACK_LIST_QUERY,
        variables: pitchWrittenFeedbackVariables,
      })
    } catch (error) {
      console.log('error!!!!!', error)
      throw error
    }

    const writtenFeedbackCheckoutUrl = `${process.env.ADDITIONAL_WRITTEN_REVIEW_PAYMENT_LINK}?prefilled_email=${session.user.email}`

    const props = {
      pitch: JSON.parse(JSON.stringify(payload.data.pitch)) as Pitch,
      ownerId: JSON.parse(JSON.stringify(payload.data.pitch.user.id)),
      pitchWrittenFeedbacks: JSON.parse(JSON.stringify(pitchWrittenFeedbackPayload.data.pitchWrittenFeedbacks)),
      writtenFeedbackCheckoutUrl,
      appV2AuthParams: {
        appV2BaseUrl: process.env.V2_BASE_URL,
        token: getSessionTokenFromRequest(context.req),
      },
    }

    return { props }
  },
)
