import { Box, Center, Link, Text, VStack, Button, Heading, Flex, Spacer } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons'
import { Alert, LinkButton, Logo } from '@components'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { TemplateSplashContent } from '../../templates/TemplateSplashContent'
import { ManageSubscriptionButton } from '@components/modules/auth';
import { PricingPageButton } from '@components/modules/core';
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getUserFromSession } from '@src/auth/get-user'
import { User } from '@binding';
import { useSession } from 'next-auth/client';
import ReactPlayer from 'react-player';
import { getFromStorage } from '@core/local';
import { url } from 'inspector';


interface PaywallPageProps {
    user: User
}

const handlePlan = (plan: string) => {
    let url;
    switch (plan) {
        case 'FOUNDER_FULL':
            url = 'https://buy.stripe.com/3cscMPcLW9B6ahWaEH'
            break;
        case 'FOUNDER_MEDIUM':
            url = 'https://buy.stripe.com/00g4gj6ny28Ebm08wy'
            break;
        case 'FOUNDER_LITE':
            url = 'https://buy.stripe.com/5kA0039zK9B6du8289'
            break;
        case 'INVESTOR':
            url = 'https://buy.stripe.com/5kA9ADfY89B61LqfZ2'
            break;
        default:
            url = 'https://buy.stripe.com/3cscMPcLW9B6ahWaEH'
    }
    return url
}
export default function PaywallPage({ user }: PaywallPageProps) {
    const userSession = useSession()
    const [planUrl, setPlanUrl] = useState("")
    const [buttonText, setButtonText] = useState("Subscribe to a Founder Full Plan")

    useEffect(() => {
        const checkout = window.localStorage.getItem("checkout")
        if (checkout !== "undefined" && checkout) {
            const checkoutLink = window.localStorage.getItem('checkout');
            const plan = `Subscribe to ${window.localStorage.getItem('plan')}`
            const fullLink = `${checkoutLink}?`.replace(/"/g, '');
            const url = `${fullLink}prefilled_email=${user?.email}&client_reference_id=${user?.id}`
            setPlanUrl(url);
            setButtonText(plan.replace(/_|"/g, ' '))

        }
        else {
            const url = handlePlan(user.capabilities[0]);
            const planName = `Subscribe to ${user.capabilities[0].replace(/_|"/g, ' ')}`
            setPlanUrl(`${url}?prefilled_email=${user?.email}&client_reference_id=${user?.id}`);
            setButtonText(planName)
        }
    }, [])
    return (
        <TemplateSplashContent>
            <Head>
                <title> Subscription</title>
            </Head>
            <Center h="100%">
                <VStack mr="5%" ml="5%" h="100%" flex={1}>
                    <Box pt="6">
                        <Logo />
                    </Box>
                    <Box textAlign="left">
                        <Heading mt="4" as="h3" size="lg" >Let's get you subscribed</Heading>
                        <Text
                            as="sub"
                            fontSize="md">
                            You're one step away from crafting an amazing pitch.
                        </Text>
                    </Box>
                    <Box>
                        <Flex
                            mt="50%"
                            flex={1}
                            direction="column"
                            height="400"
                        >
                            <Box>
                                <iframe
                                    allowFullScreen
                                    allow="autoplay"
                                    src="https://fast.wistia.net/embed/iframe/4xmu1u6wmb?seo=false&videoFoam=true"
                                />
                            </Box>
                            <Box marginBottom="auto" alignItems="center">

                            </Box>
                            <Center mb={2}>
                                <LinkButton buttonProps={{ colorScheme: 'orange' }} href={planUrl}>
                                    {buttonText}
                                </LinkButton>

                            </Center>
                            <Center mt={2}>
                                <Link
                                    size="xl"
                                    color="green"
                                    href={process.env.NEXT_PUBLIC_SCROOBIOUS_PRICING_PAGE}>
                                    I'd like to see more options.</Link>
                            </Center>
                        </Flex>
                    </Box>
                </VStack>
            </Center>
        </TemplateSplashContent>
    )
}
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const user = await getUserFromSession(context)

    if (!user || user.status !== "INACTIVE") {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: {
            user
        },
    }
}