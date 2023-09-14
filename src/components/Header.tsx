import { Heading } from '@chakra-ui/react'
import cn from 'classnames'
import React from 'react'

interface HeaderProps {
  className?: string | object
  title: string
}

export function Header({ className, title }: HeaderProps) {
  const rootClassName = cn(className, 'h-8 cursor-pointer')
  return (
    <Heading as="h4" size="md" className={rootClassName}>
      {title}
    </Heading>
  )
}
