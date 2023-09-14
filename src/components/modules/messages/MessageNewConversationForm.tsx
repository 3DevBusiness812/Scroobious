import { gql, useMutation } from '@apollo/client'
import { Conversation } from '@binding'
import { Button, Textarea } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useCallback, useState } from 'react'

interface MessageNewConversationFormProps {
  recipientId: string
  onConversationCreate: (conversation: Conversation) => any
}

export const CREATE_CONVERSATION = gql`
  mutation startConversation(
    $conversationData: ConversationCreateInput!
    $messageBody: String!
    $participantIds: [String!]!
  ) {
    startConversation(conversationData: $conversationData, messageBody: $messageBody, participantIds: $participantIds) {
      id
      friendlyName
      conversationMessages {
        id
        body
        createdAt
        createdBy {
          id
          name
          profilePictureFile {
            id
            url
          }
        }
      }

      conversationParticipants {
        id
        createdAt
        lastReadAt
        user {
          id
          name
          profilePictureFile {
            id
            url
          }
        }
      }
    }
  }
`

// TODO: modify this to use react-hook-form
export function MessageNewConversationForm({ recipientId, onConversationCreate }: MessageNewConversationFormProps) {
  const [createConversation, { data, loading, error }] = useMutation(CREATE_CONVERSATION)
  const [textAreaValue, setTextAreaValue] = useState('')

  const handleInput = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    // console.log(evt.target.value)
    setTextAreaValue(evt.target.value)
  }, [])

  const handleClick = useCallback(async () => {
    // console.log(textAreaValue)

    let result
    try {
      result = await createConversation({
        variables: {
          conversationData: {},
          messageBody: textAreaValue,
          participantIds: [recipientId],
        },
      })
    } catch (error) {
      console.error(error)
      throw error
    }

    // console.log(`result`, result)
    // console.log(`result.data.startConversation`, result.data.startConversation)
    // Move outside this component
    Router.push(`/messages/${result.data.startConversation.id}`)
    onConversationCreate(result.data.startConversation)
  }, [textAreaValue])

  return (
    <div className="flex flex-row p-2 font-bold border-t">
      <Textarea className="mr-2" onChange={handleInput} placeholder="Write a message" />
      <Button onClick={handleClick}>Submit</Button>
    </div>
  )
}
