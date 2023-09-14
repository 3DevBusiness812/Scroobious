import { Box, Button, HStack, Spacer, Text, VStack } from '@chakra-ui/react'
import { LinkButton } from '@components'
import React from 'react'

interface FounderDashboardCardProps {
  title: string
  buttonLabel?: string
  buttonHref?: string
  children: React.ReactNode
  minHeight?: number
}

export function FounderDashboardCard({
  title,
  buttonLabel,
  buttonHref,
  children,
  minHeight,
}: FounderDashboardCardProps) {
  return (
    <VStack flex={1} p={4} alignItems="flex-start" bgColor="white">
      <HStack w="full" mb={4}>
        <Box>
          <Text pl={3} borderLeftWidth="medium" borderColor="blue.400">
            {title}
          </Text>
        </Box>
        <Spacer />
        {buttonHref && !buttonHref.startsWith('http') && (
          <LinkButton
            href={buttonHref}
            buttonProps={{
              colorScheme: 'white',
              variant: 'solid',
              size: 'sm',
              textColor: 'primary.400',
              boxShadow: 'base',
            }}
          >
            {buttonLabel}
          </LinkButton>
        )}

        {buttonHref && buttonHref.startsWith('http') && (
          <a target="_blank" href={buttonHref} rel="noreferrer">
            <Button size="sm" variant="solid" colorScheme="white" textColor="primary.400" boxShadow="base">
              {buttonLabel}
            </Button>
          </a>
        )}
      </HStack>
      <Box w="100%" minH={minHeight || 250}>
        {children}
      </Box>
    </VStack>
  )
}
