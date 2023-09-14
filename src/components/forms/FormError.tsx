import React from 'react'
import { FieldErrors } from 'react-hook-form'

interface FormErrorProps extends React.HTMLAttributes<HTMLInputElement> {
  fieldId: string
  errors?: FieldErrors
}

export function FormError({ fieldId, errors }: FormErrorProps) {
  return (
    <p className="mb-1 text-sm text-red-600" id={`${fieldId}-error`}>
      {errors && errors[fieldId] && errors[fieldId].message}
      <span aria-hidden="true">&nbsp;</span>
    </p>
  )
}
