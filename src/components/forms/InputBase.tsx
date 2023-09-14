import {
  FormControl,
  FormLabel,
  Input,
  InputElementProps,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react'
import { FormError } from '@components'
import React from 'react'
import { RegisterOptions } from 'react-hook-form'

export interface InputBaseProps extends InputProps {
  required?: boolean
  fieldId: string
  inputLeftElement?: InputElementProps
  inputRightElement?: InputElementProps
  errors?: any
  label?: string
  register: any
  registerOptions?: RegisterOptions
  setValue?: any
}

const WithAddOn = ({ inputLeftElement, inputRightElement, label, fieldId, ...rest }: InputBaseProps) => {
  return (
    // Wrap with div so that when we use form vertical spacing we only get space between full entries (label + input)
    <div className="w-full">
      {label && <FormLabel htmlFor={fieldId}>{label}</FormLabel>}
      <InputGroup>
        {inputLeftElement && <InputLeftElement>{inputLeftElement}</InputLeftElement>}
        <WithoutAddOn fieldId={fieldId} {...rest} />
        {inputRightElement && <InputRightElement>{inputRightElement}</InputRightElement>}
      </InputGroup>
    </div>
  )
}

const WithoutAddOn = ({
  errors,
  fieldId,
  label,
  register,
  required,
  setValue,
  registerOptions,
  type = 'text',
  ...rest
}: InputBaseProps) => {
  const options = { ...registerOptions }
  if (required) {
    options.required = `You must specify ${label}`
  }

  return (
    <FormControl className="w-full" isInvalid={errors && errors[fieldId]}>
      {label && <FormLabel htmlFor={fieldId}>{label}</FormLabel>}
      <Input
        {...register(fieldId, options || {})}
        type={type}
        id={fieldId}
        onInput={(e: React.SyntheticEvent) => {
          const target = e.target as HTMLInputElement
          // console.log('e.target.value :>> ', e.target.value)

          // This fixes an issue where password manager pastes are
          // Not triggering an update to react-hook-form
          // Password manager pastes do not trigger onChange events, so we need
          // to use the more barebones onInput
          if (target.value) {
            setValue(fieldId, target.value)
          }
        }}
        name={fieldId}
        // No error border folor for now as all inputs don't have it
        errorBorderColor="primary"
        // errorBorderColor={errors && errors[fieldId] ? 'red.500' : ''}
        {...rest}
      />

      <FormError fieldId={fieldId} errors={errors} />
    </FormControl>
  )
}

export const InputBase = ({ inputLeftElement, inputRightElement, ...rest }: InputBaseProps) => {
  if (inputLeftElement || inputRightElement) {
    return WithAddOn({ inputLeftElement, inputRightElement, ...rest })
  }
  return WithoutAddOn({ ...rest })
}
