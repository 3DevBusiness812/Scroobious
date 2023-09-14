import { Alert as ChakraAlert, AlertIcon, AlertProps as ChakraAlertProps, AlertStatus } from '@chakra-ui/react'
import cn from 'classnames'
import React from 'react'

interface AlertProps extends ChakraAlertProps {
  children: React.ReactNode
}

export function Alert({ children, className, ...props }: AlertProps) {
  const myProps = {
    status: 'success' as AlertStatus,
    variant: 'left-accent',
    ...props,
  }

  return (
    <ChakraAlert {...myProps} className={cn(className, 'm-auto w-96')}>
      <AlertIcon />
      {children}
    </ChakraAlert>
  )
}
