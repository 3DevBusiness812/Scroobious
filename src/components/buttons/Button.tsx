import cn from 'classnames'
import Link from 'next/link'
import React from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'link' | 'none'
  children: React.ReactNode
  href?: string
  onClick?: (e?: any) => any
  className?: string
  external?: boolean
}

export function Button({ variant = 'primary', children, className, onClick, href, external }: ButtonProps) {
  const primary = 'text-white bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
  const secondary = 'text-orange-600 bg-white border hover:bg-gray-50'
  const link = 'inline text-blue-600 bg-transparent hover:underline shadow-none px-1 py-0'
  //   px-8 py-3 text-base font-medium  - size larger

  const classes = cn(
    'text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer',
    variant === 'primary' ? primary : '',
    variant === 'secondary' ? secondary : '',
    variant === 'link'
      ? link
      : 'flex justify-center px-4 py-2 text-sm font-medium  border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer',
    className,
  )

  if (external) {
    return (
      <a className={classes} href={href} download>
        {children}
      </a>
    )
  }
  if (href) {
    return (
      <Link href={href}>
        <a className={classes}>{children}</a>
      </Link>
    )
  }
  if (onClick) {
    return (
      <button onClick={onClick} className={classes}>
        {children}
      </button>
    )
  }

  return <a className={classes}>{children}</a>
}
