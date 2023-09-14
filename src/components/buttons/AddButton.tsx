import { ButtonProps } from '@chakra-ui/react'
import { LinkButton } from '@components'
import { PlusIcon } from '@heroicons/react/outline'
import React from 'react'
import { LinkButtonProps } from './LinkButton'

interface AddButtonProps extends Omit<LinkButtonProps, 'buttonProps'> {
  buttonProps?: ButtonProps
  children: React.ReactNode
}

export function AddButton(props: AddButtonProps) {
  return (
    <LinkButton {...props} buttonProps={{ colorScheme: 'orange', leftIcon: <PlusIcon className="w-6" /> }}>
      {props.children}
    </LinkButton>
  )
}
