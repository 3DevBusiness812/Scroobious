import cn from 'classnames'
import React from 'react'

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  htmlFor: string
  className?: string
  invert?: boolean
}

export function Label({ className, htmlFor, invert, children, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium', className, invert ? 'text-white' : 'text-gray-700')}
      {...props}
    >
      {children}
    </label>
  )
}

export default Label
