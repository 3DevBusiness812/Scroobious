import { Pitch } from '@binding'
import { Box, BoxProps, Flex, Heading, Spacer, Text, VStack } from '@chakra-ui/react'
import { Button, Link } from '@components'
import { useRouter } from 'next/router'
import React, { ReactNode, useState } from 'react'
import { PitchBookmarkButton } from '@components/modules/pitches/PitchBookmarkButton'

type InvestorCardLayout = 'vertical' | 'horizontal'

export interface InvestorCardProps extends BoxProps {
  pitch: Pitch
  headerContent?: ReactNode
  layout?: InvestorCardLayout
  footerContent?: ReactNode
  cardWidth: number
  disabled?: Boolean
  pitchUserStatus?: string
}

export function InvestorCard({
  headerContent,
  pitch,

  footerContent,
  layout = 'horizontal',
  cardWidth,
  pitchUserStatus,
  disabled = false,
  ...rest
}: InvestorCardProps) {
  const wrapper = layout === 'horizontal' ? 'row' : 'column'
  const titleMb = layout === 'horizontal' ? '0' : '3'
  const textMb = layout === 'horizontal' ? '1' : '6'
  const minWidth = layout === 'horizontal' ? 100 : 200
  const minH = layout === 'horizontal' ? '150px' : '400px'
  const router = useRouter()

  const [listStatus, updateListStatus] = useState(pitchUserStatus)

  return (
    <Box
      bgColor="white"
      m={2}
      minW={cardWidth}
      width={cardWidth}
      {...rest}
      shadow="md"
      borderRadius="md"
      minH={minH}
      className="hover:shadow-lg ease-in-out duration-300"
    >
      <VStack flex={1} overflow="hidden">
        <Flex flexDirection={wrapper}>
          <Box minW={minWidth}>{headerContent}</Box>

          <Box
            p="3"
            pb="3"
            bgColor="white"
            className={!disabled ? 'cursor-pointer' : undefined}
            onClick={
              disabled
                ? undefined
                : () => {
                    router.push(`/investor/pitches/${pitch.id}`)
                  }
            }
          >
            <VStack w="100%" flex={1} justifyContent="space-between" alignItems="flex-middle">
              <Heading w="100%" flexShrink={1} mb={titleMb} size="sm" fontWeight="bold">
                {disabled ? (
                  <Text noOfLines={1}>{pitch.organization.startup.name || ''}</Text>
                ) : (
                  <Link href={`/investor/pitches/${pitch.id}`}>
                    <Text noOfLines={1}>{pitch.organization.startup.name || ''}</Text>
                  </Link>
                )}
              </Heading>
              <Box w="100%" minH="100px" flexGrow={1}>
                <Text noOfLines={4} mb={textMb} fontSize="smaller">
                  {pitch.organization.startup.tinyDescription || pitch.organization.startup.shortDescription}
                </Text>
              </Box>
              <Box w="100%" flexShrink={1}>
                {footerContent}
              </Box>
              {!disabled && (
                <Flex justifyContent="center" alignItems="center">
                  <Button
                    href={`/investor/pitches/${pitch.id}`}
                    className="border-orange-400/25 hover:bg-orange-400 hover:text-white font-bold bg-orange-400/0 text-orange-400 w-full ease-in-out duration-200"
                  >
                    Learn More
                  </Button>
                  <Spacer />
                  <PitchBookmarkButton
                    className="bg-white"
                    listStatus={listStatus}
                    pitchId={pitch.id}
                    onClick={(newStatus: string) => {
                      updateListStatus(newStatus)
                    }}
                    tiny
                  />
                </Flex>
              )}
            </VStack>
          </Box>
        </Flex>
      </VStack>
    </Box>
  )
}
