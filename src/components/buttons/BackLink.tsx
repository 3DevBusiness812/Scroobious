import { ArrowBackIcon } from '@chakra-ui/icons'
import { Button, ButtonProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

export interface BackLinkProps extends ButtonProps {
  label?: string
}
export function BackLink({ label }: BackLinkProps) {
  const router = useRouter()
  return (
    <Button
      leftIcon={<ArrowBackIcon />}
      colorScheme="black"
      variant="link"
      fontWeight="medium"
      onClick={() => router.push('../')}
    >
      {label || 'Back'}
    </Button>
  )
}
