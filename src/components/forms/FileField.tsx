import React from 'react'
import { FieldErrors, RegisterOptions } from 'react-hook-form'
import { Input, Label } from '.'

interface FileFieldProps extends React.HTMLAttributes<HTMLInputElement> {
  labelClassName?: string
  label: string

  fieldId: string
  type?: string
  required?: boolean
  inputClassName?: string
  register: any
  errors: FieldErrors
  registerOptions?: RegisterOptions
}

export function FileField({
  register,
  fieldId,
  type,
  label,
  required,
  registerOptions,
  errors,
  inputClassName,
  children,
  ...props
}: FileFieldProps) {
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
