import cn from 'classnames'
import React from 'react'

interface HeaderProps {
  title: string
  center?: boolean
  className?: string
}

export const Header = function Header({ title, center, className }: HeaderProps) {
  return (
    <div className={cn('mx-auto ', { 'text-center': center }, className)}>
      <h1 className="text-xl my-4 px-4 font-medium leading-tight text-gray-900 inline-block ">{title}</h1>
    </div>
  )
}
