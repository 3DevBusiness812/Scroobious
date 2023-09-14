import { CourseProduct, Pitch, PitchWrittenFeedback } from '@binding'
import {
  Button as ChakraButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { LinkButton } from '@components'
import React, { useEffect, useState } from 'react'
import { FiVideo, FiEdit3 } from 'react-icons/fi'

interface PitchManualFeedbackModalProps {
  user: any
  isOpen: boolean
  onOpen: Function
  onClose: () => void
  onGrantWrittenReview: () => any
  onGrantVideoReview: () => any
  grantReviewLoading?: boolean
  onResetReview: (courseProduct: CourseProduct) => any
  resetReviewLoading?: boolean
}

function CourseVideoFeedbackRow({
  courseProduct,
  pitch,
  ownerId,
  onResetReview,
  resetReviewLoading = false,
}: {
  courseProduct: CourseProduct
  pitch: Pitch
  ownerId: string
  onResetReview: () => any
  resetReviewLoading?: boolean
}) {
  return (
    <Tr key={courseProduct.id} className="h-12">
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
      <Td />
      <Td>
        {courseProduct.status === 'AVAILABLE' && (
          <LinkButton
            buttonProps={{ colorScheme: 'orange', variant: 'outline', size: 'sm', mr: '3' }}
            href={`/admin/meeting-feedback/new?pitchId=${pitch.id}&courseProductId=${courseProduct.id}&ownerId=${ownerId}`}
          >
            Request
          </LinkButton>
        )}
        {courseProduct.status === 'COMPLETE' && (
          <LinkButton
            buttonProps={{ colorScheme: 'orange', variant: 'outline', size: 'sm', mr: '3' }}
            href={`/admin/meeting-feedback/${courseProduct.objectId}`}
          >
            View
          </LinkButton>
        )}
        {['COMPLETE', 'COMPLETE_MIGRATED'].includes(courseProduct.status) && (
          <ChakraButton
            colorScheme="orange"
            variant="outline"
            size="sm"
            mr="3"
            onClick={onResetReview}
            isDisabled={resetReviewLoading}
          >
            Reset
          </ChakraButton>
        )}
      </Td>
    </Tr>
  )
}

function CourseWrittenFeedbackRow({
  courseProduct,
  onResetReview,
  resetReviewLoading = false,
}: {
  courseProduct: CourseProduct
  onResetReview: () => any
  resetReviewLoading?: boolean
}) {
  // @ts-ignore
  const pitchWrittenFeedback = courseProduct.pitchWrittenFeedback as PitchWrittenFeedback

  return (
    <Tr key={courseProduct.id} className="h-12">
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
        {pitchWrittenFeedback && (
          <>
            <p>
              {
                {
                  ASSIGNED: 'Assigned',
                  REQUESTED: 'Requested',
                  DRAFT: 'Draft',
                  COMPLETE: 'Completed',
                  AWAITING_QA: 'Awaiting QA',
                }[pitchWrittenFeedback.status]
              }
            </p>
            {pitchWrittenFeedback.reviewer && (
              <p className="mt-2">
                Reviewer: <i>{pitchWrittenFeedback.reviewer.name}</i>
              </p>
            )}
          </>
        )}
      </Td>
      <Td>
        {courseProduct.status === 'COMPLETE' && (
          <LinkButton
            buttonProps={{ colorScheme: 'orange', variant: 'outline', size: 'sm', mr: '3' }}
            href={`/admin/written-feedback/${courseProduct.objectId}`}
          >
            View
          </LinkButton>
        )}
        {['COMPLETE', 'COMPLETE_MIGRATED'].includes(courseProduct.status) && (
          <ChakraButton
            colorScheme="orange"
            variant="outline"
            size="sm"
            mr="3"
            onClick={onResetReview}
            isDisabled={resetReviewLoading}
          >
            Reset
          </ChakraButton>
        )}
      </Td>
    </Tr>
  )
}

export function PitchManualFeedbackModal({
  isOpen,
  onOpen,
  onClose,
  user,
  onGrantWrittenReview,
  onGrantVideoReview,
  onResetReview,
  grantReviewLoading = false,
  resetReviewLoading = false,
}: PitchManualFeedbackModalProps) {
  const [courseProducts, setCourseProducts] = useState<any>('')
  const [pitch, setPitch] = useState<any>('')

  useEffect(() => {
    setPitch('')
    setCourseProducts('')

    if (user.pitches?.length > 0) {
      const { pitches } = user
      setPitch(pitches[0])

      if (pitches[0].course) {
        setCourseProducts(pitches[0].course.courseProducts)
      }
    }
  }, [user])

  return (
    <Modal isOpen={isOpen} size="4xl" onClose={onClose}>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="auto" backdropBlur="2px" />

      <ModalContent>
        <ModalHeader>Manage Feedback</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th />
                <Th>Name</Th>
                <Th>Product Status</Th>
                <Th>Review Status</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courseProducts.length > 0 ? (
                courseProducts
                  .sort((a: CourseProduct, b: CourseProduct) => (a.createdAt > b.createdAt ? -1 : 1))
                  .sort((a: CourseProduct, b: CourseProduct) => (a.status > b.status ? -1 : 1))
                  .sort((a: CourseProduct, b: CourseProduct) => (a.product.name > b.product.name ? -1 : 1))
                  .map((courseProduct: any) => {
                    switch (courseProduct.product.name) {
                      case '1:1 Pitch Review':
                        return (
                          <CourseVideoFeedbackRow
                            ownerId={user.id}
                            key={courseProduct.id}
                            courseProduct={courseProduct}
                            pitch={pitch}
                            onResetReview={() => onResetReview(courseProduct)}
                            resetReviewLoading={resetReviewLoading}
                          />
                        )
                        break

                      case 'Written Pitch Feedback':
                        return (
                          <CourseWrittenFeedbackRow
                            key={courseProduct.id}
                            courseProduct={courseProduct}
                            onResetReview={() => onResetReview(courseProduct)}
                            resetReviewLoading={resetReviewLoading}
                          />
                        )
                        break

                      default:
                        return <></>
                    }
                  })
              ) : (
                <p>
                  {pitch ? 'This user does not have any course products' : 'This user does not have any pitch listed'}
                </p>
              )}
            </Tbody>
          </Table>
        </ModalBody>

        <ModalFooter>
          {pitch && (
            <>
              <ChakraButton
                isDisabled={grantReviewLoading}
                colorScheme="orange"
                size="sm"
                className="mx-1"
                onClick={onGrantWrittenReview}
              >
                Grant Written Feedback
              </ChakraButton>
              <ChakraButton
                isDisabled={grantReviewLoading}
                colorScheme="orange"
                size="sm"
                className="mx-1"
                onClick={onGrantVideoReview}
              >
                Grant Video Review
              </ChakraButton>
              <Spacer />
            </>
          )}
          <ChakraButton colorScheme="orange" onClick={onClose} size="sm">
            Close
          </ChakraButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
