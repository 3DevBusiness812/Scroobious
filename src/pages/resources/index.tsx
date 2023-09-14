import React, {useEffect, useState} from 'react';
import { gql } from '@apollo/client'
import { SuggestedResource } from '@binding'
import { Box, Center, HStack, IconButton, Image, SimpleGrid, Spacer, Text } from '@chakra-ui/react'
import {
  AppNavigation,
  EmptyStateText,
  FilterColumn,
  Flex,
  Link,
  LinkButton,
  MainContent,
  PermissionGate,
} from '@components'
import { FilterBar, FilterBarConfig } from '@components/FilterBar'
import { initializeApollo } from '@core/apollo-client'
import { useCodeList } from '@core/code-list.provider'
import { protect } from '@core/server'
import { PlusIcon } from '@heroicons/react/outline'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { BiGridAlt } from 'react-icons/bi'
import { MdEdit } from 'react-icons/md'
import { processApolloError } from '../../core/apollo'

type SuggestedResourceListProps = {
  suggestedResources?: SuggestedResource[]
  errors?: string
}

const filterBarConfig: FilterBarConfig = [
  {
    label: 'Category',
    icon: BiGridAlt,
    filter: 'suggestedResourceCategoryId_eq',
    type: 'CODE_LISTBOX',
    code: 'suggestedResourceCategory',
  },
]

export default function SuggestedResourceList({ suggestedResources, errors }: SuggestedResourceListProps) {
  const [{ data, getListItemValue }] = useCodeList()
  const [loading, setLoading] = useState(true);

  if (errors) {
    return <div>Errors: {errors}</div>
  }

  if (!suggestedResources) {
    return <div>empty payload: {suggestedResources}</div>
  }

  const suggestedResourcesByCategory = [...suggestedResources].sort((a, b) => {
    if (a.suggestedResourceCategoryId > b.suggestedResourceCategoryId) {
      return -1
    }
    if (a.suggestedResourceCategoryId < b.suggestedResourceCategoryId) {
      return 1
    }
    return 0
  })

  const groupedResourceArray = []
  let currentItem: any | null = null
  for (const i in suggestedResourcesByCategory) {
    const item = suggestedResourcesByCategory[i]
    if (!currentItem) {
      currentItem = {
        id: item.suggestedResourceCategoryId,
        tittle: item.suggestedResourceCategoryId,
        children: [],
      }
      groupedResourceArray.push(currentItem)
    }
    if (item.suggestedResourceCategoryId === currentItem.id) {
      currentItem.children.push(item)
    } else {
      currentItem = {
        id: item.suggestedResourceCategoryId,
        title: item.suggestedResourceCategoryId,
        children: [item],
      }
      groupedResourceArray.push(currentItem)
    }
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
        <title>Resources</title>
      </Head>
      <FilterColumn>
        <FilterBar items={filterBarConfig} />
      </FilterColumn>
      <MainContent>
        <HStack className="p-4 sm:px-6">
          {/* <Box className="w-96 mr-4 py-4">
            <Breadcrumb spacing="8px" separator={<BsChevronRight color="gray.500" />}>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  <BiHome />
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">Resources</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box> */}
          <Spacer />
          <PermissionGate p="suggested_resource:create">
            <Box>
              <LinkButton
                href="/resources/new"
                buttonProps={{
                  bgColor: 'primary.400',
                  textColor: 'white',
                  variant: 'outline',
                  leftIcon: <PlusIcon className="w-6" />,
                }}
              >
                Add Resource
              </LinkButton>
            </Box>
          </PermissionGate>
        </HStack>

        <Flex className="px-4 sm:px-6">
          <Box className="w-full p-4" bg="whiteAlpha.900">
            {!groupedResourceArray.length && <EmptyStateText>No resources found</EmptyStateText>}

            {groupedResourceArray.map(({ id, children }: any, index) => {
              return (
                <Box key={`${id}-${children.name}`}>
                  <Box mb="6" className="mt-6 first:mt-0">
                    <Text className="pl-3" borderLeftWidth="medium" borderColor="green.400">
                      {getListItemValue(data, 'suggestedResourceCategory', id)}
                    </Text>
                  </Box>

                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 5, lg: 8 }}>
                    {children.map((item: any) => {
                      return (
                        <Box key={`${item.id}-${item.name}`} position="relative">
                          <PermissionGate p="suggested_resource:create">
                            <Box position="absolute" top={0} right={0}>
                              <Link href={`/resources/${item.id}`}>
                                <IconButton
                                  textColor="green.600"
                                  aria-label="edit-btn"
                                  variant="ghost"
                                  icon={<MdEdit />}
                                />
                              </Link>
                            </Box>
                          </PermissionGate>
                          <Box
                            flex={1}
                            key={`${item.key}`}
                            border="solid"
                            borderWidth="thin"
                            borderColor="gray.400"
                            bg="white"
                            p={4}
                            mb={4}
                            _hover={{ boxShadow: 'lg' }}
                          >
                            <Box w="100%">
                              <a target="_blank" href={`${item.url}`} rel="noreferrer">
                                <Center height={150}>
                                  <Image
                                    maxH={100}
                                    maxW="100%"
                                    className=""
                                    src={item.logoFile.url}
                                    alt={item.companyName}
                                    onError={console.error}
                                  />
                                </Center>
                              </a>
                              <Box w="100%" maxH={220} overflow="hidden">
                                <Box w="100%" h={50} overflow="hidden">
                                  <b >{item.companyName}</b>
                                </Box>
                                
                                <small>{item.description}</small>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      )
                    })}
                  </SimpleGrid>
                </Box>
              )
            })}
          </Box>
        </Flex>
      </MainContent>
    </AppNavigation>
  )
}

const SUGGESTED_RESOURCE_LIST_QUERY = gql`
  query suggestedResourceListQuery($where: SuggestedResourceWhereInput, $limit: Int) {
    suggestedResources(where: $where, limit: $limit) {
      id
      companyName
      description
      suggestedResourceCategoryId
      suggestedResourceCategory {
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

export const getServerSideProps: GetServerSideProps = protect(async (context: GetServerSidePropsContext) => {
  const client = initializeApollo({ headers: context?.req?.headers })

  // Build where filter from query string.  Use white list and remove items that are empty
  const where = { ...context.query }
  Object.keys(where).forEach((key: string) => {
    if (['suggestedResourceCategoryId_eq'].indexOf(key) < 0 || !where[key]) {
      delete where[key]
    }
  })

  try {
    const payload = await client.query({
      query: SUGGESTED_RESOURCE_LIST_QUERY,
      variables: {
        limit: 100,
        where,
      },
    })

    return {
      props: payload.data,
    }
  } catch (error) {
    // console.log('ERROR ON SUGGESTED_RESOURCE INDEX PAGE')
    const errors = processApolloError(error)
    return { props: { errors: JSON.stringify(errors) } }
  }
})
