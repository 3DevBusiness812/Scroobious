import { HStack, Icon, Text } from '@chakra-ui/react'
import React from 'react'
import { FilterItemBase } from './FilterItemBase'

interface FilterBarItemProps {
  item: FilterItemBase
  children: React.ReactNode
}

export function FilterBarItem({ item, children }: FilterBarItemProps) {
  return (
    <div key={item.code} className="mb-4">
      <HStack pb={2} alignItems="center" alignContent="center">
        {!!item.icon && <Icon as={item.icon} fontSize="md" color="black" />}
        <Text textColor="black" fontSize='md'>{item.label}</Text>
      </HStack>
      <div>{children}</div>
    </div>
  )
}
