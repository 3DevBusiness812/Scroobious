import { InputBase, InputBaseProps } from '@components'
import React from 'react'

export interface InputEmailProps extends InputBaseProps {}

export function InputEmail(props: InputEmailProps) {
  return <InputBase {...props} type="email" />
}
