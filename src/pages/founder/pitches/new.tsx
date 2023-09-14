import { AppNavigation, Card } from '@components'
import { ManageSubscriptionButton } from '@components/modules/auth'
import { usePermissions } from '@core/user.provider'
import Head from 'next/head'
import React from 'react'

export default function PitchNewPage() {
  const [{ data, error, loading: permissionsLoading, hasPermission }] = usePermissions()

  if (permissionsLoading) {
    return <div />
  }

  function getEmptyStateContent() {
    if (hasPermission(data.permissions, 'pitch:create')) {
      return (
        <p className="w-3/4 mx-auto text-base text-gray-500 text-center">
          After you have completed PiP and incorporated your personalized feedback (if on the Full plan), you can submit
          your final pitch deck and/or pitch video for potential listing on our investor-facing discovery platform. Your
          pitch material and a field to enter updates you&apos;d like to share with investors will be shown here.
        </p>
      )
    }

    return (
      <div>
        <p className="w-3/4 mx-auto text-base text-gray-500 text-center">
          Founders who subscribe to the Medium or Full plan are able to submit pitch material for potential listing on
          our investor-facing discovery platform. Pitch material and updates they&apos;d like to share with investors
          are shown here.
        </p>
        <p className="w-3/4 mx-auto text-base text-gray-500 text-center mt-8">
          Upgrade your account to access these benefits!
        </p>
        <div className="text-center mt-8">
          <ManageSubscriptionButton />
        </div>
      </div>
    )
  }

  return (
    <AppNavigation>
      <Head>
        <title>Founder Pitches</title>
      </Head>
      <div className="mx-auto max-w-7xl">
        <div className="md:flex mt-10">
          <Card className="w-2/3 mx-auto py-10">{getEmptyStateContent()}</Card>
        </div>
      </div>
    </AppNavigation>
  )
}
