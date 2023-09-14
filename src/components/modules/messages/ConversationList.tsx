import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client'
import { Conversation, ConversationParticipant, User } from '@binding'
import { Box } from '@chakra-ui/react'
import { DateFormatter } from '@core/date'
import { themeColors } from '@core/theme-colors'
import cn from 'classnames'
import React from 'react'
import { AnonymousAvatar } from '@components/AnonymousAvatar'

const MESSAGE_LIST_QUERY = gql`
  query MessageListQuery {
    conversations(limit: 20, orderBy: updatedAt_DESC) {
      id
      friendlyName
      conversationMessages {
        id
        body
        createdAt
        pitchDeckId
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
        messageAnonymously
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

    me {
      id
      name
    }
  }
`
export type MessageListQuery = any // TODO: codegen

interface ConversationListProps {
  me: User
  conversationId?: string
  conversations: Conversation[]
  onChangeConversation: (conv: Conversation) => void
}

export function getConversationList(client: ApolloClient<NormalizedCacheObject>) {
  return client.query<MessageListQuery>({
    query: MESSAGE_LIST_QUERY,
  })
}

export function ConversationList({ conversations, me, conversationId, onChangeConversation }: ConversationListProps) {
  return (
    <div className="flex-col min-h-0 mr-5 overflow-y-auto shadow w-80 sm:rounded-lg bg-white">
      <div className="flex flex-row p-2 font-bold border-b">
        <Box m={2} borderLeftWidth={3} borderLeftColor={themeColors.secondary[400]}>
          <div className="flex-1 pl-2">Messages</div>
        </Box>
      </div>

      {conversations.length === 0 && <div className="p-8 text-center">No conversations. Start one!</div>}

      {conversations.length > 0 &&
        conversations.map((conv) => {
          const lastMessage =
            conv.conversationMessages && conv.conversationMessages[conv.conversationMessages.length - 1]

          // console.log(`lastMessage`, lastMessage)
          const notMe = getCoversationOtherSideUser(conv, me.id)

          return (
            <div
              className={cn({ 'bg-orange-100  ': conv.id === conversationId }, 'flex h-24 p-3 border-b cursor-pointer')}
              key={conv.id}
              onClick={() => {
                onChangeConversation(conv)
              }}
            >
              <div className="mr-3">
                {notMe.profilePictureFile && notMe.profilePictureFile.url ? (
                  <img src={notMe!.profilePictureFile.url} alt="My profile" className="w-12 h-12 rounded-full" />
                ) : (
                  <AnonymousAvatar />
                )}
              </div>

              {lastMessage && (
                <div className="flex flex-col flex-1">
                  <div className="flex flex-row mb-2">
                    <div className="flex-1 font-bold">{notMe!.name}</div>
                    <div className="">{DateFormatter.format(lastMessage!.createdAt.toString(), 'MMM D')}</div>
                  </div>
                  <div className="text-sm">{lastMessage.body.substring(0, 30)}...</div>
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}

function getCoversationOtherSideUser(conversation: Conversation, myUserId: string) {
  const participants = conversation.conversationParticipants.filter(
    (part: ConversationParticipant) => part && part.user!.id !== myUserId,
  )
  return participants[0].user
}
