import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client'
import { Conversation, User } from '@binding'
import { AppNavigation } from '@components'
import { ManageSubscriptionButton } from '@components/modules/auth'
import { initServerSideClient, processApolloError } from '@core/apollo'
import { getRequiredSingleQueryParam } from '@core/querystring'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { usePermissions } from '@core/user.provider'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

type MessagePropsSuccess = {
  conversations: Conversation[]
  me: User
}
interface MessagePropsFail {
  errors: string
}
type MessagePageProps = MessagePropsSuccess | MessagePropsFail

function isPageError(props: MessagePageProps): props is MessagePropsFail {
  return (props as MessagePropsFail).errors !== undefined
}

export default function MessagePage(props: MessagePageProps) {
  const [{ data, error, loading: permissionsLoading, hasPermission }] = usePermissions()

  const [loading, setLoading] = useState(true)

  const loaderTimeout = () => {
    setTimeout(() => {
      setLoading(false);
    }, 250)
  }

  useEffect(() => {
    loaderTimeout()
  }, [])

  if (isPageError(props)) {
    return <div>{props.errors}</div>
  }
  if (permissionsLoading) {
    return <div />
  }

  function getEmptyStateContent() {
    // This is ugly - we're using a pitch permission to identify FOUNDER_FULL and FOUNDER_MEDIUM users here
    // So that we can use conversation_message:list below for INVESTOR users
    if (hasPermission(data.permissions, 'pitch:create')) {
      return (
        <p className="w-3/4 mx-auto text-base text-gray-500 text-center">
          Once you have crafted your pitch, you can publish it to the Scroobious Investor Portal and see messages from
          investors here.
        </p>
      )
    }

    // INVESTOR users
    if (hasPermission(data.permissions, 'conversation_message:list')) {
      return (
        <>
          <p className="w-3/4 mx-auto text-base text-gray-500 text-center">
            Founders won’t see your name or be able to contact you unless you send them a message through our platform.
            We strongly encourage you to message founders to:
          </p>
          <div className="w-full text-base text-gray-500 text-center mt-3">
            <ul className="list-disc inline-block text-left">
              <li>Schedule a chat to learn more.</li>
              <li>Provide feedback on their pitch.</li>
              <li>Offer to help/connect them to your network.</li>
              <li>Send a friendly note of encouragement.</li>
              <li>Any other reason at all!</li>
            </ul>
          </div>
        </>
      )
    }

    // FOUNDER_LITE users
    return (
      <div>
        <p className="w-3/4 mx-auto text-base text-gray-500 text-center">
          Founders who subscribe to the Medium or Full plan are able to receive messages from investors who see their
          pitch on the investor discovery platform and are interested in learning more. Correspondence with investors is
          shown here.
        </p>
        <p className="w-3/4 mx-auto text-base text-gray-500 text-center mt-8">
          Upgrade your account to access this benefit!
        </p>
        <div className="text-center mt-8">
          <ManageSubscriptionButton />
        </div>
      </div>
    )
  }

  return (
    <AppNavigation isLoading={loading}>
      <Head>
        <title>Messages</title>
      </Head>
      <div className="fixed top-0 bottom-0 left-0 right-0 mt-20 mb-2 ">
        <div className="flex flex-row items-stretch h-full mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex-col min-h-0 mr-5 overflow-y-auto shadow w-80 sm:rounded-lg bg-white">
            <div className="flex flex-row p-2 font-bold border-b">
              <div className="flex-1 p-2">Messaging</div>
              <div className="p-2 rounded cursor-pointer flex-0 hover:bg-gray-300">
                {/* <FaRegEdit
                  size="24"
                  className="hidden hover:text-orange-800"
                  onClick={() => {
                    handleComposeClick()
                  }} 
                /> */}
              </div>
            </div>
            <div className="p-8 text-center">No conversations.</div>
          </div>

          <div className="flex flex-col flex-1 flex-grow shadow sm:rounded-lg bg-white pt-16">
            {getEmptyStateContent()}
          </div>
        </div>
      </div>
    </AppNavigation>
  )
}

const MESSAGE_LIST_QUERY = gql`
  query MessageListQuery {
    conversations(limit: 20, orderBy: updatedAt_DESC) {
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

    me {
      id
      name
    }
  }
`
export type MessageListQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    // console.log('INDEX PAGE')
    const client = initServerSideClient(context)

    try {
      // Scenario: coming to screen to compose message to specific recipient, look for an existing conversation and route there
      if (context.query.recipientId) {
        const recipientId = getRequiredSingleQueryParam(context.query, 'recipientId')

        // console.log('Trying to compose to a specific recipient', context.query.recipientId)
        const existingConversation = await findExistingConversation(
          { userId1: session.user.id, userId2: recipientId },
          client,
        )

        if (existingConversation) {
          return {
            redirect: {
              destination: `/messages/${existingConversation.id}`,
              permanent: false,
            },
          }
        }
        return {
          redirect: {
            destination: `/messages/new?recipientId=${recipientId}`,
            permanent: false,
          },
        }
      }

      const messageListPayload = await client.query<MessageListQuery>({
        query: MESSAGE_LIST_QUERY,
      })

      const conversations = (messageListPayload.data.conversations as Conversation[]).filter(
        (conversation) => !!conversation.conversationMessages.length,
      )

      if (conversations && conversations.length) {
        return {
          redirect: {
            destination: `/messages/${conversations[0].id}`,
            permanent: false,
          },
        }
      }

      return {
        props: {},
      }
    } catch (error) {
      const errors = processApolloError(error)
      return { props: { errors: JSON.stringify(errors) } }
    }
  },
)

async function findExistingConversation(
  options: { userId1: string; userId2: string },
  client: ApolloClient<NormalizedCacheObject>,
): Promise<Conversation | undefined> {
  const { userId1, userId2 } = options
  type ConversationFindOneQuery = any
  const CONVERSATION_FIND_ONE_QUERY = gql`
    query ConversationFindOneQuery($userId1: String!, $userId2: String!) {
      findExistingConversation(userId1: $userId1, userId2: $userId2) {
        id
        ownerId
        friendlyName
      }
    }
  `

  const payload = await client.query<ConversationFindOneQuery>({
    query: CONVERSATION_FIND_ONE_QUERY,
    variables: {
      userId1,
      userId2,
    },
  })

  // console.log(`findExistingConversation`, payload)

  if (payload.data.findExistingConversation) {
    return payload.data.findExistingConversation
  }

  return undefined
}
