import { gql, useMutation } from '@apollo/client'
import { Button } from '@chakra-ui/react'
import { BanIcon } from '@heroicons/react/outline'
import cn from 'classnames'
import { useSession } from 'next-auth/client'
import React, { useCallback } from 'react'

interface PitchIgnoreButtonProps {
  pitchId: string
  listStatus?: string // TODO: PitchListStatus
  className?: string
  onClick?: Function
}

const IGNORE_PITCH = gql`
  mutation upsertPitchUserStatus($data: PitchUserStatusUpdateInput!, $where: PitchUserStatusWhereInput!) {
    upsertPitchUserStatus(data: $data, where: $where) {
      data {
        id
        pitchId
        userId
        updatedAt
      }
      action
    }
  }
`

export function PitchIgnoreButton({ pitchId, listStatus, className, onClick }: PitchIgnoreButtonProps) {
  const [session, sessionLoading] = useSession()
  const [upsertPitchUserStatus, { data, loading, error }] = useMutation(IGNORE_PITCH)

  const handleClick = useCallback(async () => {
    const newStatus = listStatus === 'IGNORE' ? 'DEFAULT' : 'IGNORE'
    // console.log(`newStatus`, newStatus)
    await upsertPitchUserStatus({
      variables: {
        data: { pitchId, listStatus: newStatus },
        where: { pitchId_eq: pitchId },
      },
    })
    onClick && (await onClick(newStatus))
  }, [listStatus])

  const classes = cn(className, 'mr-3 cursor-pointer')
  const color = listStatus === 'IGNORE' ? 'gray.400' : 'primary.400'
  const iconColor = listStatus === 'IGNORE' ? 'gray.400' : 'black'
  return (
    <Button
      leftIcon={<BanIcon className="w-6 text-black" />}
      as="a"
      className={classes}
      variant="outline"
      isLoading={loading}
      onClick={handleClick}
      textColor={color}
    >
      {listStatus === 'IGNORE' ? 'Un-pass' : 'Pass'}
    </Button>
  )
}
