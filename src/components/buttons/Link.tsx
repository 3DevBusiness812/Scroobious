import cn from 'classnames'
import NextLink from 'next/link'
import React from 'react'

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
}

export function Link({ href, children, className, ...props }: LinkProps) {
  return (
    <NextLink href={href}>
      <a {...props} className={cn('font-medium no-underline hover:underline', className)}>
        {children}
      </a>
    </NextLink>
  )
}
