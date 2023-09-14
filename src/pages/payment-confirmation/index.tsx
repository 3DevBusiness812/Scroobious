import { Confirmation } from '@components'
import React from 'react'

type SuccessProps = {
  message?: string
}

// eslint-disable-next-line no-empty-pattern
export default function Success({}: SuccessProps) {
  const [data, setData] = React.useState<any>()
  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    setData({
      name: query.get('name'),
      email: query.get('email'),
      plan: query.get('plan'),
    })
  }, [])

  return <Confirmation title="Thank You!" message="Payment successful" button="My Pitches" action={() => {}} />
}
