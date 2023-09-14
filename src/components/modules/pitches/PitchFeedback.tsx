import { gql, useMutation } from '@apollo/client'
import { handleApolloMutation } from '@core/request'
import { useAlert } from '@core/alert.provider'
import { CourseProduct, Pitch, PitchWrittenFeedback } from '@binding'
import {
  Box,
  Button as ChakraButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import { Header, LinkButton, Link } from '@components'
import { FiEdit3, FiVideo } from 'react-icons/fi'
import React from 'react'
import { useRouter } from 'next/router'
import { AdditionalPitchModalRequest } from './AdditionalPitchModalRequest'

const MUTATION = gql`
  mutation requestPitchWrittenFeedbackRetainDeck($data: PitchWrittenFeedbackRequestRetainDeckInput!) {
    requestPitchWrittenFeedbackRetainDeck(data: $data) {
      id
      status
      ownerId
      pitch {
        id
        userId
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
    }
  }
`

interface PitchFeedbackProps {
  pitch: Pitch
  writtenFeedbackCheckoutUrl: string
  courseProducts?: CourseProduct[]
  ownerId?: string
  gotoUploadPitchDeck?: Function
  gotoCategorizeSlides?: Function
  pitchWrittenFeedbacks?: PitchWrittenFeedback[]
}

function CourseWrittenFeedbackRow({
  courseProduct,
  pitch,
  pitchWrittenFeedbacks,
}: {
  courseProduct: CourseProduct
  pitch: Pitch
  pitchWrittenFeedbacks?: PitchWrittenFeedback[]
}) {
  const [mutate, { data, loading: isFeedbackRequesting, error }] =
    useMutation<{ requestPitchWrittenFeedbackRetainDeck: PitchWrittenFeedback }>(MUTATION)
  const { setAlert } = useAlert()
  const router = useRouter()

  const isPitchDeckCategorized = pitch.latestPitchDeck?.isCategorized

  const pitchId = pitch.id
  const courseProductId = courseProduct.id

  const onRequestWrittenFeedback = async () => {
    setAlert({ isHide: true })
    const type = 'notification'
    const timeout = 15000

    if (
      (pitchWrittenFeedbacks || []).find(
        (pitchWrittenFeedback) => pitchWrittenFeedback.originalPitchDeckId === pitch.latestPitchDeck?.id,
      )
    ) {
      setAlert({ message: 'You have already requested a review for this deck.', status: 'error', type, timeout })
      return false
    }

    const { data } = await handleApolloMutation(
      mutate({
        variables: {
          data: {
            pitchId: pitch.id,
            pitchDeck: {
              id: pitch.latestPitchDeck?.id,
            },
            courseProductId,
          },
        },
      }),
    )

    const message = data?.requestPitchWrittenFeedbackRetainDeck?.id
      ? 'Successfully requested feedback!'
      : 'Something went wrong while requesting feedback. Please try again later.'

    const status = data?.requestPitchWrittenFeedbackRetainDeck?.id ? 'success' : 'error'

    setAlert({ message, status, type, timeout })

    if (data?.requestPitchWrittenFeedbackRetainDeck?.id) {
      router.push(`/founder/written-feedback/${data.requestPitchWrittenFeedbackRetainDeck.id}`)
    }
  }

  return (
    <Tr key={courseProduct.id}>
      <td>
        <FiEdit3 />
      </td>
      <Td>{courseProduct.product.name}</Td>
      <Td>
        {
          {
            AVAILABLE: 'Available',
            COMPLETE_MIGRATED: 'Claimed',
            COMPLETE: 'Claimed',
          }[courseProduct.status]
        }
      </Td>
      <Td>
        <Flex alignItems="center">
          <Box>
            {courseProduct.status === 'AVAILABLE' && (
              <LinkButton
                buttonProps={{
                  disabled: !isPitchDeckCategorized || isFeedbackRequesting,
                  colorScheme: 'orange',
                  variant: 'outline',
                  size: 'sm',
                  mr: '3',
                  onClick: (e) => {
                    e.preventDefault()
                    onRequestWrittenFeedback()
                  },
                }}
                href="#"
              >
                {isFeedbackRequesting && <Spinner color="primary" size="sm" className="mr-2" />}
                Request
              </LinkButton>
            )}
            {courseProduct.status === 'COMPLETE' && (
              <LinkButton
                buttonProps={{ colorScheme: 'orange', variant: 'outline', size: 'sm', mr: '3' }}
                href={`/founder/written-feedback/${courseProduct.objectId}`}
              >
                View
              </LinkButton>
            )}
          </Box>
          {courseProduct.status === 'AVAILABLE' && !isPitchDeckCategorized && pitch.latestPitchDeck?.id && (
            <Box flex={1}>
              Please{' '}
              <Link href={`/founder/prepare-pitch-deck/${pitch.latestPitchDeck?.id}`}>categorize your slides</Link> to
              proceed
            </Box>
          )}
        </Flex>
      </Td>
    </Tr>
  )
}

function CourseVideoFeedbackRow({
  courseProduct,
  pitch,
  ownerId,
}: {
  courseProduct: CourseProduct
  pitch: Pitch
  ownerId?: string
}) {
  return (
    <Tr key={courseProduct.id}>
      <td>
        <FiVideo />
      </td>
      <Td>{courseProduct.product.name}</Td>
      <Td>
        {
          {
            AVAILABLE: 'Available',
            COMPLETE_MIGRATED: 'Claimed',
            COMPLETE: 'Claimed',
          }[courseProduct.status]
        }
      </Td>
      <Td>
        {courseProduct.status === 'AVAILABLE' && (
          <LinkButton
            buttonProps={{ colorScheme: 'orange', variant: 'outline', size: 'sm', mr: '3' }}
            href={`/founder/meeting-feedback/new?pitchId=${pitch.id}&courseProductId=${courseProduct.id}&ownerId=${ownerId}`}
          >
            Request
          </LinkButton>
        )}
        {courseProduct.status === 'COMPLETE' && (
          <LinkButton
            buttonProps={{ colorScheme: 'orange', variant: 'outline', size: 'sm', mr: '3' }}
            href={`/founder/meeting-feedback/${courseProduct.objectId}`}
          >
            View
          </LinkButton>
        )}
      </Td>
    </Tr>
  )
}

export function PitchFeedback({
  pitch,
  ownerId,
  writtenFeedbackCheckoutUrl,
  courseProducts,
  gotoUploadPitchDeck,
  gotoCategorizeSlides,
  pitchWrittenFeedbacks,
}: PitchFeedbackProps) {
  const { isOpen: additionalIsOpen, onOpen: additionalOnOpen, onClose: additionalOnClose } = useDisclosure()
  const isPitchDeckCategorized = pitch.latestPitchDeck?.isCategorized

  return (
    <>
      <Box className="mb-6">
        <Header title="Get Feedback" />
      </Box>
      <Box>
        {!pitch.latestPitchDeck ? (
          <div className="flex space-x-2 items-center">
            <span>Please upload your pitch deck to access feedback</span>
            <ChakraButton
              p={4}
              size="sm"
              colorScheme="orange"
              onClick={() => gotoUploadPitchDeck && gotoUploadPitchDeck()}
              border="1px"
              borderColor="orange.500"
              fontWeight="normal"
            >
              Upload Pitch Deck
            </ChakraButton>
          </div>
        ) : !isPitchDeckCategorized ? (
          <div className="flex space-x-2 items-center">
            <span>Please finish categorizing your slides to access feedback</span>
            <ChakraButton
              p={4}
              size="sm"
              colorScheme="orange"
              onClick={() => gotoCategorizeSlides && gotoCategorizeSlides()}
              border="1px"
              borderColor="orange.500"
              fontWeight="normal"
            >
              Categorize Slides
            </ChakraButton>
          </div>
        ) : (
          <Table size="sm">
            <Thead>
              <Tr>
                <Th />
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {(courseProducts || [])
                .sort((a: CourseProduct, b: CourseProduct) => (a.createdAt > b.createdAt ? -1 : 1))
                .sort((a: CourseProduct, b: CourseProduct) => (a.status > b.status ? -1 : 1))
                // Put 1:1 feedback at the bottom
                .sort((a: CourseProduct, b: CourseProduct) => {
                  return a.product.name > b.product.name ? -1 : 1
                })
                .map((courseProduct) => {
                  if (courseProduct.product.name === 'Written Pitch Feedback') {
                    return (
                      <CourseWrittenFeedbackRow
                        key={courseProduct.id}
                        courseProduct={courseProduct}
                        pitch={pitch}
                        pitchWrittenFeedbacks={pitchWrittenFeedbacks}
                      />
                    )
                  }
                  if (courseProduct.product.name === '1:1 Pitch Review') {
                    return (
                      <CourseVideoFeedbackRow
                        ownerId={ownerId}
                        key={courseProduct.id}
                        courseProduct={courseProduct}
                        pitch={pitch}
                      />
                    )
                  }
                  return <></>
                })}
              <Tr>
                <td>
                  <FiEdit3 />
                </td>
                <Td>Additional Written Feedback</Td>
                <Td>Charge - $100</Td>
                <Td>
                  <a href={writtenFeedbackCheckoutUrl}>
                    <ChakraButton colorScheme="orange" variant="outline" size="sm" mr="3">
                      Request
                    </ChakraButton>
                  </a>
                </Td>
              </Tr>
              <Tr>
                <td>
                  <FiVideo />
                </td>
                <Td>Additional Zoom Feedback</Td>
                <Td>Charge - $200</Td>
                <Td>
                  <ChakraButton colorScheme="orange" onClick={additionalOnOpen} variant="outline" size="sm" mr="3">
                    Request
                  </ChakraButton>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        )}
        <AdditionalPitchModalRequest isOpen={additionalIsOpen} onOpen={additionalOnOpen} onClose={additionalOnClose} />
      </Box>
    </>
  )
}
