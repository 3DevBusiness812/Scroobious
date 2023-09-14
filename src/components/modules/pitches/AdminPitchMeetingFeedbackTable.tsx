import { gql, useMutation } from '@apollo/client'
import { PitchMeetingFeedback, User } from '@binding'
import { Avatar, Select, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { Card, EmptyStateText, LinkButton } from '@components'
import { useAlert } from '@core/alert.provider'
import { handleApolloMutation } from '@core/request'
import { useRouter } from 'next/router'
import React from 'react'

interface AdminPitchMeetingFeedbackTableProps {
  pitchMeetingFeedbacks: PitchMeetingFeedback[]
  users: User[]
}

const MUTATION = gql`
  mutation assignPitchMeetingFeedback(
    $data: PitchMeetingFeedbackAssignInput!
    $where: PitchMeetingFeedbackWhereUniqueInput!
  ) {
    assignPitchMeetingFeedback(data: $data, where: $where) {
      id
      status
      ownerId
      pitch {
        id
        userId
        createdAt
        activePitchDeck {
          id
          status
          pitchId
          createdAt
          file {
            id
            url
          }
        }
      }
    }
  }
`

export function AdminPitchMeetingFeedbackTable({ pitchMeetingFeedbacks, users }: AdminPitchMeetingFeedbackTableProps) {
  const [mutate] = useMutation<{ requestPitchMeetingFeedback: PitchMeetingFeedback }>(MUTATION)
  const router = useRouter()
  const { setAlert } = useAlert()

  if (!pitchMeetingFeedbacks || !pitchMeetingFeedbacks.length) {
    return <EmptyStateText>No pitches found</EmptyStateText>
  }

  async function onChangeUser(userId: string, pitchMeetingFeedbackId: string) {
    setAlert({ isHide: true })
    const result = await handleApolloMutation(
      mutate({
        variables: {
          data: {
            reviewerId: userId,
          },
          where: {
            id: pitchMeetingFeedbackId,
          },
        },
      }),
    )
    // console.log('result :>> ', result)

    const updatedQueryString = { ...router.query }

    updatedQueryString['pitch-update-at'] = new Date().getTime().toString()

    router.push({
      pathname: router.pathname,
      query: updatedQueryString,
    })
    setAlert({
      type: 'notification',
      message: 'Reviewer Assigned Successfully',
      status: 'success',
      timeout: 15000,
    })
  }

  return (
    <Card>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Founder</Th>
            <Th>Status</Th>
            <Th>Reviewer</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pitchMeetingFeedbacks.map((pitchMeetingFeedback) => {
            return (
              <Tr key={pitchMeetingFeedback.id}>
                <Td>
                  <div className="float-left">
                    <Avatar src={pitchMeetingFeedback.pitch.user.profilePictureFile.url} />
                  </div>
                  <div className="float-left ml-4 mt-4">{pitchMeetingFeedback.pitch.user.name}</div>
                </Td>
                <Td>{pitchMeetingFeedback.status}</Td>
                <Td>
                  {pitchMeetingFeedback.reviewer?.name || <span className="italic text-gray-400">Unassigned</span>}
                </Td>
                <Td>
                  {pitchMeetingFeedback.status === 'ASSIGNED' ||
                    (pitchMeetingFeedback.status === 'REQUESTED' && (
                      <Select
                        placeholder="Assign Feedback To..."
                        onChange={(evt) => onChangeUser(evt.target.value, pitchMeetingFeedback.id)}
                      >
                        {users.map((user) => {
                          return (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          )
                        })}
                      </Select>
                    ))}

                  {pitchMeetingFeedback.status === 'ASSIGNED' && (
                    <LinkButton
                      buttonProps={{ size: 'sm' }}
                      href={`/admin/meeting-feedback/${pitchMeetingFeedback.id}`}
                    >
                      Complete Review
                    </LinkButton>
                  )}

                  {pitchMeetingFeedback.status === 'COMPLETE' && (
                    <LinkButton
                      buttonProps={{ size: 'sm' }}
                      href={`/admin/meeting-feedback/${pitchMeetingFeedback.id}`}
                    >
                      View
                    </LinkButton>
                  )}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Card>
  )
}
