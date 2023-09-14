import { Button, ButtonProps } from '@chakra-ui/react'
import React from 'react'

export interface ButtonSubmitProps extends ButtonProps {
  label: string
}
export function ButtonSubmit(props: ButtonSubmitProps) {
  return (
    <Button type="submit" colorScheme="orange" {...props}>
      {props.label}
    </Button>
  )
}
