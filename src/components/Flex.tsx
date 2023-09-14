import cn from 'classnames'
import React from 'react'

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Flex({ children, className, ...attrs }: FlexProps) {
  return (
    <div {...attrs} className={cn('flex', className)}>
      {children}
    </div>
  )
}
