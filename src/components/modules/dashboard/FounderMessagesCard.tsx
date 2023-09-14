import { gql, useQuery } from '@apollo/client'
import { Conversation, User } from '@binding'
import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react'
import { EmptyStateText } from '@components/typography'
import React from 'react'
import { ConversationPresenter } from '../messages/ConversationPresenter'
import { FounderDashboardCard } from './FounderDashboardCard'

const QUERY = gql`
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

const CardContent = () => {
  const { loading, error, data } = useQuery<{ conversations: Conversation[]; me: User }>(QUERY, {
    variables: { orderBy: 'updatedAt_DESC', limit: 3 },
  })

  const hasAccess = true

  if (!data) {
    return <div />
  }
  const conversations = new ConversationPresenter(data?.conversations, data?.me).formatted()

  // const data = [
  //   { name: 'Allison Byers', message: 'sed do eiusmod tempor incididunt ut ', messageTime: '2022-02-28' },
  //   { name: 'Smith White', message: 'Lorem ipsum dolor sit amet, consectetur adipisci', messageTime: '2022-02-27' },
  //   { name: 'Easther Howard', message: 'Sed ut perspiciatis unde omnis iste', messageTime: '2022-02-26' },
  // ]

  if (!hasAccess) {
    return (
      <EmptyStateText
        className="px-8"
        title="'Members on the Full plan are able to upload final pitch material, request to be listed in the investor-facing platform, and message with investors who contact them. Please upgrade your account to access these benefits'"
      />
    )
  }

  if (!conversations.length) {
    return <EmptyStateText className="w-full text-center" title="No Data Available" />
  }

  return (
    <>
      {conversations.map((item) => {
        return (
          <Box key={item.notMe.name} w="full">
            <HStack p={2} w="full" flex={1}>
              <Avatar name={item.notMe.name} src={item.notMe.profilePictureFile.url} mr={2} />
              <VStack w="70%" flexGrow={1} alignItems="flex-start">
                <Text>{item.notMe.name}</Text>
                <Text fontSize="sm" textColor="gray.500" noOfLines={1}>
                  {item.lastMessage.body}
                </Text>
              </VStack>
              <Box flexShrink={1}>
                <Text textColor="gray.500"> {item.timeSinceMessage}</Text>
              </Box>
            </HStack>
          </Box>
        )
      })}
    </>
  )
}

export function FounderMessagesCard() {
  return (
    <FounderDashboardCard title="Stay In Touch" buttonLabel="View All Messages" buttonHref="/messages" minHeight={250}>
      <CardContent />
    </FounderDashboardCard>
  )
}
