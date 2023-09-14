import { Button, ButtonProps } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'

export interface LinkButtonProps {
  href: string
  buttonProps?: ButtonProps
  className?: string
  children?: React.ReactNode
}

export function LinkButton({ href, children, className, buttonProps }: LinkButtonProps) {
  return (
    <NextLink href={href} passHref>
      <Button className={className} {...buttonProps}>
        {children}
      </Button>
    </NextLink>
  )
}
