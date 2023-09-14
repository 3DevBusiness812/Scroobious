import { AppNavigation, FormPanel } from '@components'
import { UserInviteForm } from '@components/modules/users/UserInviteForm'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

type PerkNewPageProps = {
  errors?: string
}

export default function PerkNewPage({ errors }: PerkNewPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const onSuccess = () => {
    return router.push('/admin/users?action=created')
  }

  if (errors) {
    return <div>Error loading page</div>
  }

  return (
    <AppNavigation isLoading={isLoading}>
      <div className="mx-auto mt-16">
        <FormPanel>
          <UserInviteForm onSuccess={onSuccess} />
        </FormPanel>
      </div>
    </AppNavigation>
  )
}
