import React from 'react'
import { Pitch } from '@binding'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { EmptyStateText, LinkButton, PDFViewer } from '@components'
import { PitchPublishButton } from '@components/modules/pitches'
import ReactPlayer from 'react-player'

interface AdminPitchTableProps {
  pitches: Pitch[]
}

export function AdminPitchTable({ pitches }: AdminPitchTableProps) {
  if (!pitches || !pitches.length) {
    return <EmptyStateText>No pitches found</EmptyStateText>
  }

  function pitchPublishSuccess(pitchId: string) {
    // console.log(`Published ${pitchId}`)
  }

  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>Video</Th>
          <Th>Company</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {pitches.map((pitch) => {
          return (
            <Tr key={pitch.id}>
              <Td>
                <div className="text-center w-56">
                  {pitch.activePitchVideo?.video?.wistiaUrl && (
                    <ReactPlayer width="100%" height="150px" url={pitch.activePitchVideo?.video?.wistiaUrl} controls />
                  )}
                  {!pitch.activePitchVideo?.video?.wistiaUrl && pitch.activePitchDeck?.file?.url && (
                    <PDFViewer width={200} url={pitch.activePitchDeck.file.url} />
                  )}
                  {!pitch.activePitchVideo?.video?.wistiaUrl && !pitch.activePitchDeck?.file?.url && (
                    <div>No video or deck</div>
                  )}
                </div>
              </Td>
              <Td>{pitch.organization.startup.name}</Td>
              <Td>{pitch.status}</Td>
              <Td>
                <PitchPublishButton status={pitch.status} pitchId={pitch.id} onSuccess={pitchPublishSuccess} />
                <LinkButton
                  className="ml-2"
                  href={`/founder/pitches/${pitch.id}`}
                  buttonProps={{ size: 'sm', colorScheme: 'orange' }}
                >
                  View Pitch
                </LinkButton>
                {/* http://localhost:3000/founder/pitches/GED_s_zdePn9pUADMCmVf */}
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}
