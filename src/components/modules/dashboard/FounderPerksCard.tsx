import { gql, useQuery } from '@apollo/client'
import { Perk } from '@binding'
import { Box, HStack, Link, SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'
import { FounderDashboardCard } from './FounderDashboardCard'

const QUERY = gql`
  query PerkListQuery($limit: Int, $orderBy: PerkOrderByInput) {
    perks(limit: $limit, orderBy: $orderBy) {
      id
      companyName
      companyBio
      description
      perkCategoryId
      perkCategory {
        id
        description
        archived
      }
      url
      logoFile {
        url
      }
    }
  }
`

const CardContent = () => {
  const { loading, error, data } = useQuery<{ perks: Perk[] }>(QUERY, {
    variables: { orderBy: 'updatedAt_DESC', limit: 3 },
  })

  if (loading || !data || !data.perks) {
    return <div />
  }

  return (
    <HStack minH={250} w="full" alignItems="flex-start">
      <SimpleGrid columns={{ base: 3, md: 3 }} spacing={{ base: 3, lg: 4 }}>
        {data.perks.map((item) => {
          return (
            <Box key={item.id} w={178} bgColor="white" borderWidth={2} borderColor="gray.300" p={4} mt={4}>
              <Link textDecoration="none" href="/perks">
                <Text noOfLines={6}>
                  <strong>{item.companyName}</strong>: {item.description}{' '}
                </Text>
              </Link>
            </Box>
          )
        })}
      </SimpleGrid>
    </HStack>
  )
}

export function FounderPerksCard() {
  return (
    <FounderDashboardCard title="Current Perks" buttonLabel="View All Perks" buttonHref="/perks" minHeight={250}>
      <CardContent />
    </FounderDashboardCard>
  )
}
