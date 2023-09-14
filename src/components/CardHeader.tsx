import cn from 'classnames'
import React from 'react'

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  const classes = cn(className, 'text-lg font-medium leading-6 text-gray-900')

  return <h2 className={classes}>{children}</h2>
}
