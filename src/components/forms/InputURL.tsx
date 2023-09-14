import { InputBase, InputBaseProps } from '@components'
import React from 'react'

export interface InputURLProps extends InputBaseProps {
  icon?: string
}
export function InputURL(props: InputURLProps) {
  return (
    <InputBase
      {...props}
      // The current implementation causes the icons to bleed over the dropdowns above them
      // inputRightElement={
      //   <IconButton
      //     size="xs"
      //     variant="ghost"
      //     icon={props.icon == 'linkedIn' ? <FaLinkedin size={20} /> : <AiFillTwitterCircle size={20} />}
      //     aria-label="show"
      //   />
      // }
    />
  )
}
