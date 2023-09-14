import { gql, useQuery } from '@apollo/client'
import { SlackMessage } from '@binding'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Box, Heading, Link, Text, Icon } from '@chakra-ui/react'
import { EmptyStateText } from '@components/typography'
import React from 'react'
import { FounderDashboardCard } from './FounderDashboardCard'
import { AiOutlineSlack } from "react-icons/ai";

const QUERY = gql`
  query SlacksQuery {
    slacks {
      messages {
        text
        html
      }
    }
  }
`

const CardContent = () => {
  const { loading, error, data } = useQuery<{ slacks: { messages: SlackMessage[] } }>(QUERY)

  const hasAccess = true

  if (!data) {
    return <div />
  }

  if (!hasAccess) {
    return (
      <EmptyStateText
        className="px-8"
        title="'Members on the Full plan are able to upload final pitch material, request to be listed in the investor-facing platform, and message with investors who contact them. Please upgrade your account to access these benefits'"
      />
    )
  }

  if (!data.slacks.messages.length) {
    return <EmptyStateText className="w-full text-center" title="No Data Available" />
  }
  console.log(data.slacks)
  return (
    <>
      <Box>
        <Heading
          textAlign="center"
          fontSize="md"
        >
          Our Most Recent Slacks
        </Heading>
        <Text p={5} shadow="sm" textAlign="center" fontSize="sm"  >
          Join our Scroobious community Slack channel
          <Link isExternal href="https://join.slack.com/t/scroobiouscommunity/shared_invite/zt-n3dr3g6s-T1KBHvbxWmbysId76uRm_w">
            {` here`}
            <ExternalLinkIcon color="green.400" mx="2px" />
            .
          </Link>
        </Text>
      </Box>
      {data.slacks.messages
        .map((item) => {
          return (
            <Box as="div" mb={4} shadow="md" p={4}>
              <Text
                dangerouslySetInnerHTML={{ __html: item.html }}
                noOfLines={5} key={item.ts}
                w="full"
                fontSize={14}
              />

            </Box>
          )
        })
        .slice(0, 3)
      }
    </>
  )
}

export function FounderCommunityCard() {
  return (
    <FounderDashboardCard
      title="The Scroobious Community"
      buttonLabel="Join The Community"
      buttonHref="https://join.slack.com/t/scroobiouscommunity/shared_invite/zt-n3dr3g6s-T1KBHvbxWmbysId76uRm_w"
      minHeight={200}
    >
      <CardContent />
    </FounderDashboardCard>
  )
}
