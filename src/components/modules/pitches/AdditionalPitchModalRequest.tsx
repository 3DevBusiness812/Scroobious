import React from 'react'
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
import { InlineWidget } from 'react-calendly'

interface PitchFeedbackModalProps {
  isOpen: boolean
  onOpen: Function
  onClose: () => void
}

declare global {
  interface Window {
    Calendly: any
  }
}

export function AdditionalPitchModalRequest({ isOpen, onOpen, onClose }: PitchFeedbackModalProps) {
  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="auto" backdropBlur="2px" />

      <ModalContent>
        <ModalHeader>Request Additional Feedback</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InlineWidget url="https://calendly.com/allison_byers/additional-pitch-review" styles={{ height: '500px' }} />
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
