import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client'
import { Conversation, ConversationMessage, User } from '@binding'
import { AppNavigation } from '@components'
import { Message } from '@components/modules/conversations'
import { ConversationList, getConversationList, MessageSendMessage } from '@components/modules/messages'
import { initServerSideClient, processApolloError } from '@core/apollo'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { getSessionTokenFromRequest } from '@core/cookie'
import { authV2AndRedirect } from '@src/auth/auth-v2'
import { AnonymousAvatar } from '@components/AnonymousAvatar'

type MessagePageProps = {
  conversations: Conversation[]
  conversation: Conversation
  me: User
  appV2AuthParams: {
    appV2BaseUrl: string
    token: string
  }
}
// interface MessagePropsFail {
//   errors: string
// }
// type MessagePageProps = MessagePropsSuccess | MessagePropsFail

// function isPageError(props: MessagePageProps): props is MessagePropsFail {
//   return (props as MessagePropsFail).errors !== undefined
// }

export default function MessagePage(props: MessagePageProps) {
  const router = useRouter()
  const messagesEndRef = useRef(null) // For scrolling to bottom
  const [messages, updateMessages] = useState(props.conversation?.conversationMessages || [])
  // console.log('router.query.cid', router.query.cid)

  // if (isPageError(props)) {
  //   return <div>{props.errors}</div>
  // }

  const handleViewPitchDeck = (pitchDeckId: string | null | undefined, messageId: string | null | undefined = null) => {
    if (pitchDeckId) {
      authV2AndRedirect({
        ...props.appV2AuthParams,
        redirectSlug: `/pitch-deck-messenger/${pitchDeckId}${messageId ? `?messageId=${messageId}` : ''}`,
      })
    }
  }

  const { conversations, conversation, me } = props

  // console.log(`conversation`, conversation)

  let notMe: User | null = null
  if (conversation) {
    notMe = getCoversationOtherSideUser(conversation, me.id)
  }

  const scrollToBottom = (options: ScrollIntoViewOptions = { behavior: 'auto' }) => {
    const messageEnd = messagesEndRef.current as any
    messageEnd && messageEnd.scrollIntoView(options)
  }

  useEffect(() => {
    updateMessages(props.conversation?.conversationMessages || [])
  }, [props.conversation?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages.length])

  const onChangeConversation = (conversation: Conversation) => {
    router.push({
      pathname: `/messages/${conversation.id}`,
    })
  }

  const handleNewMessage = (message: ConversationMessage) => {
    // console.log(`handleNewMessage`, message)
    // console.log(`messages before`, messages)
    updateMessages([...messages, message])
    // console.log(`messages after`, messages)

    scrollToBottom({ behavior: 'smooth' })
  }

  // console.log(`messages`, messages)
  // console.log(`notMe`, notMe)

  return (
    <AppNavigation>
      <Head>
        <title>Messages</title>
      </Head>
      <div className="fixed top-0 bottom-0 left-0 right-0 mt-20 mb-2">
        <div className="flex flex-row items-stretch h-full mx-auto max-w-7xl">
          <ConversationList conversations={conversations} me={me} onChangeConversation={onChangeConversation} />
          {messages && notMe && (
            <div className="flex flex-col flex-1 flex-grow shadow sm:rounded-lg bg-white">
              <div className="flex flex-row p-2 font-bold border-b">
                {notMe.profilePictureFile && notMe.profilePictureFile.url ? (
                  <img src={notMe.profilePictureFile.url} alt="My profile" className="w-12 h-12 mr-4 rounded-full" />
                ) : (
                  <AnonymousAvatar />
                )}
                <div className="p-2">{notMe.name}</div>
              </div>
              <div className="flex-1 px-3 overflow-y-auto scrolling-touch scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2">
                {messages &&
                  messages.map((message) => {
                    // console.log(`message.user.id`, message.createdBy.id)
                    // console.log(`me.id`, me.id)

                    return (
                      <Message
                        className="mt-3 first:pt-2"
                        key={message.id}
                        message={message}
                        isMe={message.createdBy.id === me.id}
                        onViewPitchDeck={() => handleViewPitchDeck(message.pitchDeckId, message.id)}
                      />
                    )
                  })}
                <div className="pb-4" ref={messagesEndRef} />
              </div>
              <MessageSendMessage conversationId={conversation.id} onMessageCreate={handleNewMessage} />
            </div>
          )}
        </div>
      </div>
    </AppNavigation>
  )
}

export const getServerSideProps: GetServerSideProps = protect(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    const client = initServerSideClient(context)

    const { conversationId } = context.query
    // console.log(`conversationId`, conversationId)

    try {
      const messageListPayload = await getConversationList(client)

      const conversations = (messageListPayload.data.conversations as Conversation[])
        .filter((conversation) => !!conversation.conversationMessages.length)
        .map((conversation) => {
          const anonymousUserIds = conversation.conversationParticipants
            .filter((participant) => participant.messageAnonymously)
            .map((participants) => participants.user.id)

          return {
            ...conversation,
            conversationMessages: conversation.conversationMessages.map((message) => ({
              ...message,
              createdBy: anonymousUserIds.includes(message.createdBy.id)
                ? {
                    name: 'Posted Anonymously',
                  }
                : message.createdBy,
            })),
            conversationParticipants: conversation.conversationParticipants.map((participant) => ({
              ...participant,
              user: participant.messageAnonymously
                ? {
                    name: 'Posted Anonymously',
                  }
                : participant.user,
            })),
          }
        })

      const conversation = conversations.find((conversation) => {
        // console.log('find')
        // console.log('conversation.id', conversation.id)
        // console.log('conversationId', conversationId)
        return conversation.id === conversationId
      })
      // console.log(`conversation`, conversation)

      const result = {
        props: p({
          ...messageListPayload.data,
          conversations,
          conversation,
          appV2AuthParams: {
            appV2BaseUrl: process.env.V2_BASE_URL,
            token: getSessionTokenFromRequest(context.req),
          },
        }),
      }

      // addApolloState(client, result)
      return result
    } catch (error) {
      const errors = processApolloError(error)
      return { props: { errors: JSON.stringify(errors) } }
    }
  },
)

function p(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

function getCoversationOtherSideUser(conversation: Conversation, myUserId: string) {
  const participants = conversation.conversationParticipants!.filter((part) => part.user.id !== myUserId)
  return participants[0].user
}

async function findUser(where: { id: string }, client: ApolloClient<NormalizedCacheObject>): Promise<User | undefined> {
  // Currently only supporting search by id, but other params should work too
  if (!where.id) {
    return
  }

  type UserFindOneQuery = any
  const USER_FIND_ONE_QUERY = gql`
    query UserFindOneQuery($where: UserWhereUniqueInput!) {
      user(where: $where) {
        id
        name
        profilePictureFile {
          id
          url
        }
      }
    }
  `

  const payload = await client.query<UserFindOneQuery>({
    query: USER_FIND_ONE_QUERY,
    variables: {
      where,
    },
  })

  // console.log(`findUser`, payload)

  if (payload.data.user) {
    return payload.data.user
  }
}
