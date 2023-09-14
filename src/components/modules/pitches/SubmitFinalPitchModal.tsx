import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalCloseButton,
} from '@chakra-ui/react'
import { PermissionGate } from '@components'

interface SubmitFinalPitchModalProps {
  isOpen: boolean
  onClose: any
  onOpenFeedback: any
  onSubmit: any
}

export const SubmitFinalPitchModal = ({ isOpen, onClose, onOpenFeedback, onSubmit }: SubmitFinalPitchModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent padding="5">
        <ModalHeader textAlign="center" fontWeight="bold">
          Submit Final Pitch
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="sm" mb={5} textAlign="center">
          By clicking the “Submit Final Pitch” button below, you are submitting your final pitch for potential listing
          on our investor-facing platform.
          <PermissionGate p="pitch_written_feedback:request">
            {
              ' If you would like to instead submit your pitch for feedback from the Scroobious team, click the “Request Feedback” button below.'
            }
          </PermissionGate>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <PermissionGate p="pitch_written_feedback:request">
            <Button colorScheme="orange" mr={3} onClick={onOpenFeedback}>
              Request Feedback
            </Button>
          </PermissionGate>
          <Button onClickCapture={onClose} onClick={onSubmit} colorScheme="green">
            Submit Final Pitch
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
