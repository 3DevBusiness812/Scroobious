import { gql, useQuery } from '@apollo/client'
import { LinkButton } from '@components'
import { LinkButtonProps } from '@components/buttons'
import React from 'react'

interface ManageSubscriptionButtonProps extends Partial<LinkButtonProps> {
  title?: string
  className?: string
}

const QUERY = gql`
  query {
    manageStripeSubscription {
      url
    }
  }
`

export function ManageSubscriptionButton({
  title = 'Upgrade!',
  children,
  className,
  ...rest
}: ManageSubscriptionButtonProps) {
  const { loading, error, data } = useQuery<{ manageStripeSubscription: any }>(QUERY)
  const colorScheme = rest.buttonProps?.colorScheme || 'orange'

  return (
    <LinkButton
      {...rest}
      className={className}
      href={data?.manageStripeSubscription.url || ''}
      buttonProps={{ colorScheme, disabled: loading || !data }}
    >
      {title || children}
    </LinkButton>
  )
}
