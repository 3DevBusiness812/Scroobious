import { CourseProduct, Pitch } from '@binding'
import {
  Button as ChakraButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import React from 'react'
import { PitchFeedback } from '@components/modules/pitches/PitchFeedback'

interface PitchFeedbackModalProps {
  pitch: Pitch
  courseProducts: CourseProduct[]
  isOpen: boolean
  onOpen: Function
  onClose: () => void
  writtenFeedbackCheckoutUrl: string
  ownerId?: string
}

export function PitchFeedbackModal({
  pitch,
  courseProducts,
  isOpen,
  onOpen,
  onClose,
  ownerId,
  writtenFeedbackCheckoutUrl,
}: PitchFeedbackModalProps) {
  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="auto" backdropBlur="2px" />

      <ModalContent>
        <ModalHeader>Feedback</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <PitchFeedback
            pitch={pitch}
            courseProducts={courseProducts}
            writtenFeedbackCheckoutUrl={writtenFeedbackCheckoutUrl}
          />
        </ModalBody>
        <ModalFooter>
          <ChakraButton colorScheme="orange" onClick={onClose} size="sm">
            Close
          </ChakraButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
