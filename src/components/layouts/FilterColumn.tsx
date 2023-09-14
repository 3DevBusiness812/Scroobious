import { Box } from '@chakra-ui/react'
import { themeColors } from '@core/theme-colors'
import React from 'react'

interface HeaderProps {
  children: React.ReactNode
}

export function FilterColumn({ children }: HeaderProps) {
  //   const rootClassName = cn(className, 'h-8 cursor-pointer')
  return (
    <Box bgColor={themeColors.light[800]} p={4} w={{ base: 'full', sm: 64 }}>
      {children}
    </Box>
  )
}
