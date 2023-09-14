import React from 'react'
import { FieldErrors, RegisterOptions } from 'react-hook-form'
import { Input, Label } from '.'

interface InputFieldProps extends React.HTMLAttributes<HTMLInputElement> {
  labelClassName?: string
  label: string

  readonly?: boolean
  fieldId: string
  type?: string
  required?: boolean
  inputClassName?: string
  register: any
  errors: FieldErrors
  registerOptions?: RegisterOptions
}

export function InputField({
  register,
  fieldId,
  type,
  label,
  readonly,
  required,
  registerOptions,
  errors,
  inputClassName,
  children,
  ...props
}: InputFieldProps) {
  const options = { ...registerOptions }
  // Required shortcut
  if (required) {
    options.required = `You must specify ${label}`
  }

  return (
    <div>
      {label && (
        <Label className="mb-1" htmlFor={fieldId}>
          {label}
        </Label>
      )}
      <Input
        className={inputClassName}
        {...{
          readonly,
          register,
          required,
          fieldId,
          type,
          registerOptions: options,
          errors,
        }}
        {...props}
      >
        {children}
      </Input>
    </div>
  )
}

export default Input
