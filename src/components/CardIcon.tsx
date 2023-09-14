import { Avatar, Heading, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { FiChevronRight } from 'react-icons/fi'

interface CardIconProps {
  icon: any
  title: string
  subTitle: string
  bgColor: string
  iconColor: string
}

export function CardIcon({ icon, title, subTitle, bgColor, iconColor }: CardIconProps) {
  return (
    <HStack justifyContent="space-between" bgColor={bgColor} p={4} borderRadius={8} flex={1} w="full">
      <Avatar bgColor="blue.200" icon={icon} />
      <VStack alignItems="flex-start" spacing={0}>
        <Heading size="sm">{title}</Heading>
        <Text>{subTitle}</Text>
      </VStack>
      <Icon as={FiChevronRight} color={iconColor} />
    </HStack>
  )
}
