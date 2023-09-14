import { gql, useMutation } from '@apollo/client'
import { PitchStatus } from '@binding'
import { Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'

interface PitchPublishButtonProps {
  status: PitchStatus
  pitchId: string
  onSuccess: Function
}

const PUBLISH_PITCH = gql`
  mutation publishPitch($where: PitchWhereUniqueInput!) {
    publishPitch(where: $where) {
      id
    }
  }
`
const UNPUBLISH_PITCH = gql`
  mutation unpublishPitch($where: PitchWhereUniqueInput!) {
    unpublishPitch(where: $where) {
      id
    }
  }
`

export function PitchPublishButton({ pitchId, status, onSuccess }: PitchPublishButtonProps) {
  const router = useRouter()
  const [mutate, { loading }] = useMutation(status === 'PUBLISHED' ? UNPUBLISH_PITCH : PUBLISH_PITCH)

  const handleClick = useCallback(async () => {
    await mutate({
      variables: {
        where: { id: pitchId },
      },
    })

    const updatedQueryString = { ...router.query }

    updatedQueryString['pitch-update-at'] = new Date().getTime().toString()

    router.push({
      pathname: router.pathname,
      query: updatedQueryString,
    })

    onSuccess && onSuccess()
  }, [pitchId])

  return (
    <Button size="sm" colorScheme="orange" isLoading={loading} onClick={handleClick}>
      {status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
    </Button>
  )
}
