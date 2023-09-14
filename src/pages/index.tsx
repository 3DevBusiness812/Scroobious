import { Link, LinkButton, Logo } from '@components'
import { PricingPageButton } from '@components/modules/core'
import { getUserFromSession } from '@src/auth/get-user'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React from 'react'

export default function IndexPage() {
  return (
    <div className="relative bg-gray-50">
      <div className="relative bg-white shadow">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <div className="flex items-center justify-between py-4 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <a href="/">
                <Logo className="w-auto h-8 sm:h-10" />
              </a>
            </div>
            <div className="items-center justify-end hidden md:flex md:flex-1 lg:w-0">
              <LinkButton
                href="/auth/login"
                buttonProps={{ colorScheme: 'orange', variant: 'outline', size: 'sm', mr: '3' }}
              >
                Sign in
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
      <main className="lg:relative">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <div className="flex flex-row pt-16 pb-20 mx-auto text-center max-w-7xl lg:py-48 lg:text-left">
            <div className="px-4 lg:w-1/2 sm:px-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block xl:inline">A </span>
                <span className="block text-orange-600 xl:inline">human-first </span>
                <span className="block xl:inline">fundraising experience.</span>
              </h1>
              <p className="max-w-md mx-auto mt-3 text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                A pitch video platform for undernetworked founders to be discovered by the right investors with the
                right message in the right way.
              </p>
              <p className="max-w-md mx-auto mt-3 text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                Because you can&apos;t put a person in a static pitch deck.
              </p>
              <p className="max-w-md mx-auto mt-3 text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                Not a member? Join us!
              </p>
              <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                <PricingPageButton />
              </div>
            </div>
            <div className="flex items-center flex-grow">
              <div className="flex-1 text-center">
                Or
                <Link href="https://www.scroobious.com/founders" className="text-blue-600 mx-1">
                  Learn More
                </Link>
                about the Scroobious experience.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// This server side method serves as the main routing redirect
// You should be able to send a user here and they'll always end up back in the right place
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await getUserFromSession(context)

  // console.log('session', session)

  if (user) {
    const userType: 'FOUNDER_LITE' | 'FOUNDER_MEDIUM' | 'FOUNDER_FULL' | 'INVESTOR' | 'ADMIN' | 'REVIEWER' =
      (user.capabilities && user.capabilities[0]) as any

    if (user.status === 'INACTIVE') {
      return {
        redirect: {
          permanent: false,
          destination: '/auth/subscription',
        },
      }
    }
    if (user.status === 'ONBOARDING' || user.status === 'ONBOARDING_STARTUP') {
      const founderUrl = user.status === 'ONBOARDING' ? '/founder/onboarding' : '/founder/onboarding?step=startup'
      const url: string = {
        FOUNDER_LITE: founderUrl,
        FOUNDER_MEDIUM: founderUrl,
        FOUNDER_FULL: founderUrl,
        INVESTOR: '/investor/onboarding',
        REVIEWER: 'not possible to be in ONBOARDING',
        ADMIN: 'not possible to be in ONBOARDING',
      }[userType]

      return {
        redirect: {
          permanent: false,
          destination: url,
        },
      }
    }

    if (user.status === 'ACTIVE') {
      const url: string = {
        FOUNDER_LITE: '/founder/dashboard',
        FOUNDER_MEDIUM: '/founder/courses',
        FOUNDER_FULL: '/founder/courses',
        INVESTOR: '/investor/pitches',
        ADMIN: '/admin/users',
        REVIEWER: '/admin/written-feedback',
      }[userType]

      return {
        redirect: {
          permanent: false,
          destination: url,
        },
      }
    }
  }

  return {
    props: {},
  }
}
