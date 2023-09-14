import { LinkButton } from '@components'
import React from 'react'

interface PricingPageButtonProps {
  title?: string
  className?: string
}

export function PricingPageButton({ title = 'Sign up!', className }: PricingPageButtonProps) {
  return (
    <LinkButton
      className={className}
      href={process.env.NEXT_PUBLIC_SCROOBIOUS_PRICING_PAGE!}
      buttonProps={{ colorScheme: 'orange' }}
    >
      {title}
    </LinkButton>
  )
}
