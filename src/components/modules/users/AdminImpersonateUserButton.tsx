import { User } from '@binding'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Button,
  Box,
  Textarea,
  MenuItem,
} from '@chakra-ui/react'
import React, { useState } from 'react'
interface AdminImpersonateUserButtonProps {
  user: User
}

export function AdminImpersonateUserButton({ user }: AdminImpersonateUserButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <>
      
      <MenuItem icon={<ExternalLinkIcon />} colorScheme="orange" onClick={onOpen}>
        Impersonate
      </MenuItem>
    

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.700" backdropFilter="auto" backdropBlur="2px" />
        <ModalContent>
          <form method="POST" action="/api/auth/impersonate" onSubmit={(e) => {
            e.preventDefault()
            setIsSubmitting(true)
            e.currentTarget.submit()
          }}>
            <input name="userId" type="hidden" defaultValue={user.id} />
            <ModalHeader>Impersonate User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Please describe briefly why you're impersonating <strong>{user.name}</strong>:
              <Box py={3}>
                <Textarea name="reason" onInput={(e) => setReason(e.currentTarget.value)}></Textarea>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={onClose} mr={3}>
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="orange"
                disabled={reason.length < 4 || isSubmitting}
                isLoading={isSubmitting}
                loadingText='Submitting'
              >
                Impersonate
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
