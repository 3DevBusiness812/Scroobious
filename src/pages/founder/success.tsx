import { Box, Center, Link, Text, VStack, Button, Heading, Flex, Spacer } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons'
import { Alert, LinkButton, Logo } from '@components'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { TemplateSplashContent } from '../../templates/TemplateSplashContent'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getUserFromSession } from '@src/auth/get-user'
import { getSingleQueryParam } from '@core/querystring'

interface SuccessPageProps {
    csrfToken: string
}

export default function SuccessPage({ }: SuccessPageProps) {
    const router = useRouter();

    return (
        <TemplateSplashContent>
            <Head>
                <title> Success Page</title>
            </Head>
            <Center h="100%">
                <VStack mr="5%" ml="5%" h="100%" flex={1}>
                    <Box pt="6">
                        <Logo />
                    </Box>
                    <Box textAlign="left">
                        <Heading mt="4" as="h3" size="lg" > Welcome to the Community</Heading>
                        <Text
                            as="sub"
                            fontSize="md">
                            We're glad that you're here.
                        </Text>
                    </Box>
                    <Box>
                        <Flex
                            mt="50%"
                            flex={1}
                            direction="column"
                            height="200">
                            <Box marginBottom="auto" alignItems="center">
                                <Center>
                                    <CheckIcon
                                        fill="green"
                                        color="green.400"
                                        boxSize="16"
                                    />
                                </Center>
                                <Center>
                                    <Text
                                        mt={2}
                                        fontSize="2xl"
                                        color="green.400"
                                        as="b" >
                                        Payment successful
                                    </Text>
                                </Center>
                            </Box>
                            <Center>
                                <LinkButton buttonProps={{ colorScheme:'orange', size:'lg' }} className='' href='/founder/onboarding' >
                                    Let's get started
                                </LinkButton>
                            </Center>
                        </Flex>
                    </Box>
                </VStack>
            </Center>
        </TemplateSplashContent>
    )
}
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const user = await getUserFromSession(context);
    const payment = getSingleQueryParam(context.query, 'payment')

    if(payment !== 'success') {
        return {
            redirect: {
                permanent: false,
                destination: `/auth/subscription`
            }
        }
    }
    
    return {
        props: {},
    }

}
