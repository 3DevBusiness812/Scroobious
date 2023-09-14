import { Box, IconButton, Tooltip } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'
import React, { useState } from 'react'
import { FaUserSlash } from 'react-icons/fa'

export function StopImpersonationButton() {
  const [session] = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!session?.impersonatingFromUserId) {
    return <></>
  }

  return (
    <Box position={'fixed'} zIndex="docked" bottom={2} left={2}>
      <form method="POST" action="/api/auth/impersonate/stop" onSubmit={(e) => {
        e.preventDefault()
        setIsSubmitting(true)
        e.currentTarget.submit()
      }}>
        <Tooltip
          hasArrow
          label={`Stop impersonating ${session.user.name}`}
          placement="right"
          bg="orange.300"
          color="black"
        >
          <IconButton
            type="submit"
            variant="outline"
            rounded="full"
            colorScheme="orange"
            aria-label="Stop Impersonation"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            icon={<FaUserSlash />}
          />
        </Tooltip>
      </form>
    </Box>
  )
}
