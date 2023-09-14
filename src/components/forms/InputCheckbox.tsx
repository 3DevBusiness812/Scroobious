import { Checkbox, CheckboxProps, FormControl, FormErrorMessage } from '@chakra-ui/react'
import { FormError } from '@components'
import { default as React } from 'react'
import { RegisterOptions } from 'react-hook-form'

export interface InputCheckBoxProps extends CheckboxProps {
  fieldId: string
  errors?: any
  label?: string
  register: any
  registerOptions?: RegisterOptions
}

export function InputCheckbox({ label, register, registerOptions, fieldId, errors, ...rest }: InputCheckBoxProps) {
  return (
    <FormControl isInvalid={errors && errors[fieldId]}>
      <Checkbox
        {...register(fieldId, registerOptions || {})}
        id={fieldId}
        name={fieldId}
        errorBorderColor={errors && errors[fieldId] ? 'red.500' : ''}
        {...rest}
      >
        {label}
      </Checkbox>
      <FormErrorMessage>
        <FormError fieldId={fieldId} errors={errors} />
      </FormErrorMessage>
    </FormControl>
  )
}
