import { gql, useMutation } from '@apollo/client'
import { ConversationMessage } from '@binding'
import { Button, Textarea } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'

interface MessageSendMessageProps {
  conversationId: string
  onMessageCreate: (newMessage: ConversationMessage) => any
}

export const CREATE_CONVERSATION_MESSAGE = gql`
  mutation createConversationMessage($data: ConversationMessageCreateInput!) {
    createConversationMessage(data: $data) {
      id
      conversationId
      createdBy {
        id
        name
        profilePictureFile {
          id
          url
        }
      }
      body
    }
  }
`

export function MessageSendMessage({ conversationId, onMessageCreate }: MessageSendMessageProps) {
  const [createConversationMessage, { data, loading, error }] =
    useMutation<{ createConversationMessage: ConversationMessage }>(CREATE_CONVERSATION_MESSAGE)
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm()

  const onSubmit = async (data: any) => {
    // console.log(textAreaValue)

    const message = await createConversationMessage({
      variables: {
        data: {
          body: data.body,
          conversationId,
        },
      },
    })

    setValue('body', '')

    return onMessageCreate && message.data && onMessageCreate(message.data.createConversationMessage)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-row p-2 font-bold border-t">
        <Textarea
          id="body"
          {...register('body', { required: true })}
          className="mr-2"
          placeholder="Write a message"
          disabled={loading}
        />
        <Button type="submit" colorScheme="orange" loading={loading ? 1 : undefined}>
          Submit
        </Button>
      </div>
    </form>
  )
}
