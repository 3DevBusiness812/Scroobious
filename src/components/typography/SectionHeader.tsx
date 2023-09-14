import { Text, TextProps } from '@chakra-ui/react'
import React from 'react'

interface SectionHeaderProps extends TextProps {
  title: string
}

export const SectionHeader = function SectionHeader({ title, ...rest }: SectionHeaderProps) {
  return (
    <Text {...rest} mb={4} fontWeight="bold" pl={2} borderLeftWidth="medium" borderColor="green.400">
      {title}
    </Text>
  )
}
