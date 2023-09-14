import { gql, useMutation } from '@apollo/client'
import { Button } from '@chakra-ui/button'
import { BookmarkIcon as BookmarkIconUnchecked } from '@heroicons/react/outline'
import { BookmarkIcon as BookmarkIconChecked } from '@heroicons/react/solid'
import cn from 'classnames'
import React, { useCallback } from 'react'

interface PitchBookmarkButtonProps {
  pitchId: string
  listStatus?: string
  className?: string
  onClick?: Function
  tiny?: Boolean
}

const BOOKMARK_PITCH = gql`
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

const BookmarkIcon = (props: any) => {
  const { checked } = props
  return checked ? <BookmarkIconChecked {...props} /> : <BookmarkIconUnchecked {...props} />
}

export function PitchBookmarkButton({
  pitchId,
  listStatus,
  className,
  onClick,
  tiny = false,
}: PitchBookmarkButtonProps) {
  const [upsertPitchUserStatus, { loading }] = useMutation(BOOKMARK_PITCH)

  const handleClick = useCallback(async () => {
    const newStatus = listStatus === 'BOOKMARK' ? 'DEFAULT' : 'BOOKMARK'
    // console.log(`newStatus`, newStatus)
    await upsertPitchUserStatus({
      variables: {
        data: { pitchId, listStatus: newStatus },
        where: { pitchId_eq: pitchId },
      },
    })
    onClick && (await onClick(newStatus))
  }, [listStatus])

  const color = listStatus === 'BOOKMARK' ? 'gray.500' : 'primary.400'

  return (
    <Button
      leftIcon={
        <BookmarkIcon
          checked={listStatus === 'BOOKMARK'}
          aria-label="Bookmarked"
          onClick={(e: any) => {
            e.stopPropagation()
            handleClick()
          }}
          className={cn(
            'w-6 cursor-pointer',
            listStatus === 'BOOKMARK' ? 'text-green-400' : tiny ? 'text-orange-400' : 'text-black',
          )}
          aria-hidden="true"
        />
      }
      className="cursor-pointer"
      style={tiny ? { marginRight: '-18px' } : undefined}
      as="a"
      variant={tiny ? 'ghost' : 'outline'}
      isLoading={loading}
      onClick={(e: any) => {
        e.stopPropagation()
        handleClick()
      }}
      textColor={color}
      bgColor="white"
    >
      {tiny ? '' : 'Bookmark'}
    </Button>
  )
}
