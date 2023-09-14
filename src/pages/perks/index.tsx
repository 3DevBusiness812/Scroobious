import { gql } from '@apollo/client'
import { Perk } from '@binding'
import { Box, IconButton, SimpleGrid, Spacer } from '@chakra-ui/react'
import {
  AddButton,
  AppNavigation,
  EmptyStateText,
  FilterColumn,
  Flex,
  Link,
  MainContent,
  PermissionGate,
} from '@components'
import { FilterBar, FilterBarConfig } from '@components/FilterBar'
import { PerkCard } from '@components/modules/perks'
import { initializeApollo } from '@core/apollo-client'
import { protect } from '@core/server'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { BiGridAlt } from 'react-icons/bi'
import { MdEdit } from 'react-icons/md'
import { processApolloError } from '../../core/apollo'

type PerkListProps = {
  perks?: Perk[]
  errors?: string
}

const filterBarConfig: FilterBarConfig = [
  {
    label: 'Category',
    icon: BiGridAlt,
    filter: 'perkCategoryId_eq',
    type: 'CODE_LISTBOX',
    code: 'perkCategory',
  },
]

export default function PerkList({ perks, errors }: PerkListProps) {
  const [loading, setLoading] = useState(true);
  if (errors) {
    return <div>Errors: {errors}</div>
  }

  if (!perks) {
    return <div>empty payload: {perks}</div>
  }

  const loaderTimeout = () => {
    setTimeout(()=> {
      setLoading(false);
    },250)
  }

  useEffect(() => {
    loaderTimeout();
  }, [])

  return (
    <AppNavigation isLoading={loading}>
      <Head>
        <title>Perks</title>
      </Head>
      <FilterColumn>
        <FilterBar items={filterBarConfig} />
      </FilterColumn>

      <MainContent className="py-4 px-2 space-y-4">
        <Flex>
          {/* <Box className="w-96 mx-4 py-4">
            <Breadcrumb spacing="8px" separator={<BsChevronRight color="gray.500" />}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/founder/pitches">
                  <BiHome />
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="/perks">Perks</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box> */}

          <PermissionGate p="perk:create">
            <Spacer />
            <Box>
              <AddButton href="/perks/new">Add New</AddButton>
            </Box>
          </PermissionGate>
        </Flex>
        <Box maxW="7xl" mx="auto" px={{ base: 2, sm: 12, md: 17 }}>
          {!perks.length && <EmptyStateText>No perks found</EmptyStateText>}

          {perks.length > 0 && (
            <>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
                {!!perks.length &&
                  perks.map((perk) => {
                    return (
                      <Box position="relative">
                        <PermissionGate p="perk:create">
                          <Box position="absolute" top={0} right={0}>
                            <Link href={`/perks/${perk.id}`}>
                              <IconButton aria-label="edit-btn" variant="ghost" icon={<MdEdit />} />
                            </Link>
                          </Box>
                        </PermissionGate>
                        <PerkCard perk={perk} />
                      </Box>
                    )
                  })}
              </SimpleGrid>
            </>
          )}
        </Box>
      </MainContent>
    </AppNavigation>
  )
}

const PERK_LIST_QUERY = gql`
  query PerkListQuery($where: PerkWhereInput, $limit: Int) {
    perks(where: $where, limit: $limit) {
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
export type PerkListQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect(async (context: GetServerSidePropsContext) => {
  const client = initializeApollo({ headers: context?.req?.headers })
  // console.log(`context.query`, context.query)

  // Build where filter from query string.  Use white list and remove items that are empty
  const where = { ...context.query }
  Object.keys(where).forEach((key: string) => {
    if (['perkCategoryId_eq'].indexOf(key) < 0 || !where[key]) {
      delete where[key]
    }
  })

  // console.log(`where`, where)

  try {
    const payload = await client.query<PerkListQuery>({
      query: PERK_LIST_QUERY,
      variables: {
        limit: 100,
        where,
      },
    })

    // console.log('payload :>> ', JSON.stringify(payload, undefined, 2))

    const result = {
      props: payload.data,
    }
    // addApolloState(client, result)
    return result
  } catch (error) {
    // console.log('ERROR ON PERK INDEX PAGE')
    const errors = processApolloError(error)
    return { props: { errors: JSON.stringify(errors) } }
  }
})
