import { Box } from '@chakra-ui/react'
import cn from 'classnames'
import React from 'react'

interface HeaderProps {
  children: React.ReactNode
  className?: string
}

export function FormPanel({ children, className }: HeaderProps) {
  const classes = cn(className || 'w-96', 'px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10')

  //   const rootClassName = cn(className, 'h-8 cursor-pointer')
  return <Box className={classes}>{children}</Box>
}
