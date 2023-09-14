import { InputBase, InputBaseProps } from '@components'
import React from 'react'

export interface TextFieldProps extends InputBaseProps {}

export function TextField(props: TextFieldProps) {
  return <InputBase {...props} type="text" />
}
