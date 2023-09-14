import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client'
import { Conversation, User } from '@binding'
import { AppNavigation } from '@components'
import { ConversationList, getConversationList, MessageNewConversationForm } from '@components/modules/messages'
import { initServerSideClient, processApolloError } from '@core/apollo'
import { getRequiredSingleQueryParam } from '@core/querystring'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

type MessagePageProps = {
  conversations: Conversation[]
  me: User
  recipient?: User
}

export default function MessagePage(props: MessagePageProps) {
  // console.log(`MessagePage props`, props)
  const router = useRouter()
  // console.log('router.query.cid', router.query.cid)

  const { conversations, me, recipient } = props

  const onConversationCreate = (conversation: Conversation) => {
    router.push({
      pathname: `/messages/${conversation.id}`,
    })
  }

  const onChangeConversation = (conversation: Conversation) => {
    router.push({
      pathname: `/messages/${conversation.id}`,
    })
  }

  return (
    <AppNavigation>
      <Head>
        <title>Messages</title>
      </Head>
      <div className="fixed top-0 bottom-0 left-0 right-0 mt-20 mb-2">
        <div className="flex flex-row items-stretch h-full mx-auto max-w-7xl">
          <ConversationList conversations={conversations} me={me} onChangeConversation={onChangeConversation} />

          {recipient && (
            <div className="flex flex-col flex-1 flex-grow shadow sm:rounded-lg bg-white">
              <div className="flex flex-row p-2 font-bold border-b">
                <img src={recipient!.profilePictureFile?.url} alt="My profile" className="w-12 h-12 mr-4 rounded-full" />
                <div className="p-2">New message to {recipient!.name}</div>
              </div>
              {/* Spacer */}
              <div className="flex-1" />
              <MessageNewConversationForm onConversationCreate={onConversationCreate} recipientId={recipient!.id} />
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

    try {
      const recipientId = getRequiredSingleQueryParam(context.query, 'recipientId')
      if (!recipientId) {
        // TODO: redirect to main messages list with error message
        return { props: {} }
      }
      const recipient = await findUser({ id: recipientId }, client)
      const messageListPayload = await getConversationList(client)

      const result = {
        props: p({ ...messageListPayload.data, recipient }),
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

  if (payload.data.user) {
    return payload.data.user
  }
}
