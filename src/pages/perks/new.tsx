import { AppNavigation, FormPanel } from '@components'
import { PerkForm } from '@components/modules/perks'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

type PerkNewPageProps = {
  errors?: string
}

export default function PerkNewPage({ errors }: PerkNewPageProps) {
  const router = useRouter()

  const onSuccess = () => {
    return router.push('/perks?action=created')
  }

  if (errors) {
    return <div className="">Error loading page</div>
  }

  return (
    <AppNavigation>
      <div className="mx-auto mt-16">
        <FormPanel>
          <PerkForm onSuccess={onSuccess} />
        </FormPanel>
      </div>
    </AppNavigation>
  )
}

export const getServerSideProps: GetServerSideProps = protect<PerkNewPageProps>(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    return {
      props: {},
    }
  },
)
