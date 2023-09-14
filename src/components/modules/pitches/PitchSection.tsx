import { Pitch } from '@binding'
import { Box, HStack, Tag, Text } from '@chakra-ui/react'
import { PDFViewer } from '@components'
import { InvestorCard } from '@components/modules/pitches/InvestorCard'
import { useCodeList } from '@core/code-list.provider'
import { useRouter } from 'next/router'
import React from 'react'
import ReactPlayer from 'react-player'

interface PitchSectionProps {
  pitches?: Pitch[]
  investorCardLayout?: 'vertical' | 'horizontal'
  cardWidth?: number
  pitchUserStatuses?: any
}

function companyStageBadge(name: any) {
  const bgColor: string =
    (
      {
        idea: 'blue.100',
        seed: 'orange.100',
        growth: 'green.100',
        'pre-seed': 'cyan.100',
        other: 'purple.100',
      } as any
    )[name.toLowerCase()] || 'gray.100'

  const textColor: string =
    (
      {
        idea: 'blue.400',
        seed: 'orange.400',
        growth: 'green.400',
        'pre-seed': 'cyan.400',
        other: 'purple.400',
      } as any
    )[name.toLowerCase()] || 'gray.400'

  return (
    <Tag size="sm" variant="solid" bgColor={bgColor} border="1px" borderColor={textColor} textColor={textColor}>
      {name.toLowerCase()}
    </Tag>
  )
}

export const PitchSection = ({
  pitches,
  investorCardLayout = 'horizontal',
  cardWidth,
  pitchUserStatuses,
}: PitchSectionProps) => {
  const [{ data, getListItemValue }] = useCodeList()

  const HeaderContent = ({ pitch }: { pitch: Pitch }) => {
    const router = useRouter()

    const playerHeight = investorCardLayout === 'horizontal' ? 160 : 160
    return (
      <Box flex={1}>
        <div className="w-full">
          {pitch.activePitchVideo?.video?.wistiaUrl && (
            <ReactPlayer
              width="280px"
              height={`${playerHeight}px`}
              url={pitch.activePitchVideo?.video?.wistiaUrl}
              onClickPreview={() => {
                router.push(`/investor/pitches/${pitch.id}`)
              }}
            />
          )}
          {!pitch.activePitchVideo?.video?.wistiaUrl && pitch.activePitchDeck && (
            <Box className="max-h-48 mb-2" height={playerHeight}>
              <PDFViewer url={pitch.activePitchDeck.file.url} height={playerHeight} />
            </Box>
          )}
        </div>
      </Box>
    )
  }

  const FooterContent = ({ pitch }: { pitch: Pitch }) => {
    if (investorCardLayout === 'vertical') {
      return (
        <HStack alignItems="flex-start" className="mb-2">
          {companyStageBadge(pitch.organization.startup.companyStage)}
          <Tag size="sm" variant="subtle" bgColor="white" border="1px" borderColor="gray.400" textColor="gray">
            {getListItemValue(data, 'revenue', pitch.organization.startup.revenue)}
          </Tag>
        </HStack>
      )
    }
    return (
      <HStack justifyContent="space-between">
        <Text fontSize="xs">{getListItemValue(data, 'fundingStatus', pitch.organization.startup.fundraiseStatus)}</Text>
        {companyStageBadge(pitch.organization.startup.companyStage)}
      </HStack>
    )
  }

  if (!pitches || !pitches.length) {
    return <div>No Pitches</div>
  }

  return (
    <>
      {pitches.map((pitch) => {
        return (
          <InvestorCard
            key={pitch.id}
            pitch={pitch}
            headerContent={<HeaderContent pitch={pitch} />}
            layout={investorCardLayout}
            footerContent={<FooterContent pitch={pitch} />}
            cardWidth={cardWidth || 200}
            pitchUserStatus={pitchUserStatuses && pitchUserStatuses[pitch.id]}
          />
        )
      })}
    </>
  )
}
