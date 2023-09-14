import { HStack, Icon, Spacer, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import cn from 'classnames'
import React from 'react'

interface InsightCardProps {
  icon: any
  stat: string
  name: string
  iconColor: string
  className?: string
}

export function InsightCard({ icon, name, stat, iconColor, className }: InsightCardProps) {
  const classes = cn(className, '')
  return (
    <Stat w={250} px={{ base: 4, md: 8 }} py="3" shadow="xl" bgColor="white" className={classes}>
      <HStack alignItems="flex-end">
        <Spacer />
        <Icon fontSize="l" w={10} h={10} as={icon} color={iconColor} />
      </HStack>
      <StatNumber fontSize="4xl" fontWeight="medium">
        {stat}
      </StatNumber>
      <StatLabel fontWeight="medium" noOfLines={2}>
        {name}
      </StatLabel>
    </Stat>
  )
}
