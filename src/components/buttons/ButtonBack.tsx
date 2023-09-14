import { ArrowBackIcon } from '@chakra-ui/icons'
import { Button, ButtonProps } from '@chakra-ui/react'

export interface ButtonBackProps extends ButtonProps {
  label?: string
}
export function ButtonBack(props: ButtonBackProps) {
  return (
    <Button leftIcon={<ArrowBackIcon />} colorScheme="black" variant="link">
      {props.label}
    </Button>
  )
}
