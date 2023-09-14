import { Box } from '@chakra-ui/react'
import { Flex } from '@components'
import cn from 'classnames'
import React from 'react'

interface HeaderProps {
  title?: string
  className?: string
  children?: any
  minHeight?: number
}

export const EmptyStateText = function EmptyStateText({ title, className, children, minHeight }: HeaderProps) {
  const classes = cn(className, 'text-gray-500 bg-white rounded-md text-md justify-center items-center')

  return (
    <Flex style={{ minHeight: minHeight || 240 }} className={classes}>
      {children || <Box>{title}</Box>}
    </Flex>
  )
}
