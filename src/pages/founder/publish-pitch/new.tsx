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
        <div>
          <p className="mx-auto text-base text-gray-500">
            Before publishing pitch to investors, please:
            <ul className="list-disc pl-7 mt-3 space-y-2">
              <li>
                upload your pitch deck{' '}
                <a className="underline text-orange-600" href="founder/pitches/upload-pitch-deck">
                  here
                </a>
                ;
              </li>
              <li>
                upload your 1 Minute pitch video{' '}
                <a className="underline text-orange-600" href="/founder/pitches/upload-pitch-short-video">
                  here
                </a>
                ;
              </li>
              <li>
                upload your 5 Minute pitch video{' '}
                <a className="underline text-orange-600" href="/founder/pitches/upload-pitch-extended-video">
                  here
                </a>{' '}
                (optional).
              </li>
            </ul>
          </p>
          <p className="mx-auto mt-7 text-base text-gray-500">
            After you have this completed, you will be able to publish pitch to investors.
          </p>
        </div>
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
          <Card className="mx-auto py-10">{getEmptyStateContent()}</Card>
        </div>
      </div>
    </AppNavigation>
  )
}
