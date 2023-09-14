import { Image, ImageProps } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

interface LogoProps extends ImageProps {
  linkUrl?: string
}

export function Logo(props: LogoProps) {
  const { linkUrl } = props

  return (
    <Link href={linkUrl || '/'}>
      <Image
        className="max-w-xs cursor-pointer"
        loading="eager"
        maxHeight={100}
        maxWidth={225}
        src="/scroobious_logo.png"
        alt="Scroobious"
      />
    </Link>
  )
}
