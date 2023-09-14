import { Perk } from '@binding'
import { Box, Center, HStack, Image, Text, VStack } from '@chakra-ui/react'
import { truncate } from '@core/string'
import React from 'react'
import { BiLink } from 'react-icons/bi'

interface PerkCardProps {
  perk: Perk
}

const CardFooter = ({ perk }: PerkCardProps) => {
  return (
    <Box flexShrink={1}>
      <HStack>
        <BiLink size={20} />
        <a target="_blank" href={perk.url} rel="noreferrer">
          <Text fontSize="sm" textColor="blue.400">
            {truncate(perk.url, 30)}
          </Text>
        </a>
      </HStack>
    </Box>
  )
}

const CardContent = ({ perk }: PerkCardProps) => {
  return (
    <Box flexGrow={1} height="150px">
      <Text noOfLines={2} className="text-ellipsis overflow-hidden" mb={2} fontSize="sm" fontWeight="bold">
        {perk.companyBio}
      </Text>
      <Text noOfLines={6} fontSize="sm" className="text-gray-600 text-ellipsis overflow-hidden">
        {perk.description}
      </Text>
    </Box>
  )
}

const CardHeader = ({ perk }: PerkCardProps) => {
  return (
    <Box flexShrink={1} w="100%">
      <Center mb={2} mx={4} height={100}>
        <Image maxH={100} maxW="100%" src={perk.logoFile.url} alt={perk.companyName} />
      </Center>
    </Box>
  )
}

export function PerkCard({ perk }: PerkCardProps) {
  return (
    <Box flex={1} bgColor="white" p={4} borderColor="gray.200" borderBottomColor="green.300" borderBottomWidth="3px">
      <VStack flex={1} spacing={6} w="100%" alignItems="flex-start">
        <CardHeader perk={perk} />
        <CardContent perk={perk} />
        <CardFooter perk={perk} />
      </VStack>
    </Box>
  )
}
