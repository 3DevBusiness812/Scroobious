import { Box } from '@chakra-ui/react'
import cn from 'classnames'
import React from 'react'

interface HeaderProps {
  children: React.ReactNode
  className?: string
}

export function MainContent({ children, className }: HeaderProps) {
  const classes = cn(className, 'flex-1 overflow-auto')

  //   const rootClassName = cn(className, 'h-8 cursor-pointer')
  return <Box className={classes}>{children}</Box>
}
