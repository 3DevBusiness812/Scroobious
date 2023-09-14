import { gql, useMutation } from '@apollo/client'
import { PitchWrittenFeedback, User } from '@binding'
import { Avatar, Select, Table, Tbody, Td, Th, Thead, Tr, Button } from '@chakra-ui/react'
import { Card, EmptyStateText, LinkButton } from '@components'
import { useSession } from 'next-auth/client'
import { useAlert } from '@core/alert.provider'
import { handleApolloMutation } from '@core/request'
import { useRouter } from 'next/router'
import React from 'react'

interface AdminPitchWrittenFeedbackTableProps {
  pitchWrittenFeedbacks: PitchWrittenFeedback[]
  users: User[]
}

const MUTATION = gql`
  mutation assignPitchWrittenFeedback(
    $data: PitchWrittenFeedbackAssignInput!
    $where: PitchWrittenFeedbackWhereUniqueInput!
  ) {
    assignPitchWrittenFeedback(data: $data, where: $where) {
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

export function AdminPitchWrittenFeedbackTable({
  pitchWrittenFeedbacks,
  users,
}: AdminPitchWrittenFeedbackTableProps) {
  const [mutate] = useMutation<{ requestPitchWrittenFeedback: PitchWrittenFeedback }>(MUTATION)
  const router = useRouter()
  const { setAlert } = useAlert()
  const [session] = useSession()

  const userId = session?.user.id

  if (!pitchWrittenFeedbacks || !pitchWrittenFeedbacks.length) {
    return <EmptyStateText>No pitches found</EmptyStateText>
  }

  async function onChangeUser(userId: string, pitchWrittenFeedbackId: string) {
    setAlert({ isHide: true })
    const result = await handleApolloMutation(
      mutate({
        variables: {
          data: {
            reviewerId: userId,
          },
          where: {
            id: pitchWrittenFeedbackId,
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
          {pitchWrittenFeedbacks.map((pitchWrittenFeedback) => {
            return (
              <Tr key={pitchWrittenFeedback.id}>
                <Td>
                  <div className="float-left">
                    <Avatar src={pitchWrittenFeedback.pitch.user.profilePictureFile.url} />
                  </div>
                  <div className="float-left ml-4 mt-4">{pitchWrittenFeedback.pitch.user.name}</div>
                </Td>
                <Td>{pitchWrittenFeedback.status}</Td>
                <Td>
                  {pitchWrittenFeedback.reviewer?.name || <span className="italic text-gray-400">Unassigned</span>}
                </Td>
                <Td>
                  {pitchWrittenFeedback.status === 'ASSIGNED' ||
                    (pitchWrittenFeedback.status === 'REQUESTED' &&
                      (userId && users.length === 1 && users[0].id === userId ? (
                        <Button size="sm" onClick={() => onChangeUser(userId, pitchWrittenFeedback.id)}>
                          Claim for Review
                        </Button>
                      ) : (
                        <Select
                          placeholder="Assign Feedback To..."
                          onChange={(evt) => onChangeUser(evt.target.value, pitchWrittenFeedback.id)}
                        >
                          {users.map((user) => {
                            return (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            )
                          })}
                        </Select>
                      )))}

                  {pitchWrittenFeedback.status === 'ASSIGNED' && (
                    <LinkButton
                      buttonProps={{ size: 'sm' }}
                      href={`/admin/written-feedback/${pitchWrittenFeedback.id}`}
                    >
                      Complete Review
                    </LinkButton>
                  )}

                  {pitchWrittenFeedback.status === 'COMPLETE' && (
                    <LinkButton
                      buttonProps={{ size: 'sm' }}
                      href={`/admin/written-feedback/${pitchWrittenFeedback.id}`}
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
