import { FormControl, FormLabel, Textarea, TextareaProps } from '@chakra-ui/react'
import { FormError } from '@components'
import React from 'react'
import { RegisterOptions } from 'react-hook-form'

export interface TextareaFieldProps extends TextareaProps {
  fieldId: string
  errors?: any
  label?: string
  register: any
  registerOptions?: RegisterOptions
}

export const TextareaField = ({ errors, fieldId, label, register, registerOptions, ...rest }: TextareaFieldProps) => {
  return (
    <FormControl isInvalid={errors && errors[fieldId]}>
      {label && <FormLabel htmlFor={fieldId}>{label}</FormLabel>}
      <Textarea
        {...register(fieldId, registerOptions || {})}
        id={fieldId}
        name={fieldId}
        // No red boarder for now as all components don't have it
        errorBorderColor="primary"
        // errorBorderColor={errors && errors[fieldId] ? 'red.500' : ''}
        {...rest}
      />
      <FormError fieldId={fieldId} errors={errors} />
    </FormControl>
  )
}
