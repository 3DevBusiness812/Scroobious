import { AppNavigation, FormPanel } from '@components'
import { SuggestedResourceForm } from '@components/modules/suggested-resources'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

type SuggestedResourceNewPageProps = {
  errors?: string
}

export default function SuggestedResourceNewPage(props: SuggestedResourceNewPageProps) {
  const router = useRouter()

  const onSuccess = (data: any) => {
    return router.push('/resources?action=created')
  }

  return (
    <AppNavigation>
      <div className="mx-auto mt-16">
        <FormPanel>
          <SuggestedResourceForm onSuccess={onSuccess} />
        </FormPanel>
      </div>
    </AppNavigation>
  )
}

export const getServerSideProps: GetServerSideProps = protect<SuggestedResourceNewPageProps>(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    return {
      props: {},
    }
  },
)
