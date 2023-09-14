import { IconButton } from '@chakra-ui/react'
import { InputBase, InputBaseProps } from '@components'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'

export interface InputPasswordProps extends InputBaseProps {}

export function InputPassword(props: InputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false)
  const handleClick = () => setShowPassword(!showPassword)
  return (
    <InputBase
      {...props}
      type={showPassword ? 'text' : 'password'}
      inputRightElement={
        <IconButton
          size="xs"
          variant="ghost"
          aria-label={showPassword ? 'Show' : 'Hide'}
          icon={showPassword ? <EyeIcon className="w-5" /> : <EyeOffIcon className="w-5" />}
          onClick={handleClick}
        />
      }
    />
  )
}
