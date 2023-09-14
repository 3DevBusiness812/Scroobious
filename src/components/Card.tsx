import cn from 'classnames'
import React from 'react'
import { SectionHeader } from './typography'

export interface CardProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function Card({ children, title, className }: CardProps) {
  const classes = cn(className, 'w-full py-4 bg-white sm:rounded-lg spacing-y-4')

  return (
    <div className={classes}>
      {title && <SectionHeader ml={[4, 6]} title={title!} />}
      <div className="px-4 sm:px-6">{children}</div>
    </div>
  )
}
