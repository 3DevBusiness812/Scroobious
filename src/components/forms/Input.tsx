import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import { FieldErrors, RegisterOptions } from 'react-hook-form'
import { FormError } from './FormError'

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  fieldId: string
  type?: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean
  className?: string
  register: any
  errors: FieldErrors
  registerOptions?: RegisterOptions
}

export function Input({
  register,
  fieldId,
  type,
  required,
  readonly,
  registerOptions,
  errors,
  className,
  disabled,
  children,
  ...props
}: InputProps) {
  type = type || 'text'

  const [ariaErrorAttributes, setAriaErrorAttributes] = useState({})

  useEffect(() => {
    const ariaAttributes = errors[fieldId]
      ? {
          'aria-invalid': 'true',
          'aria-describedby': `${fieldId}-error`,
        }
      : {}
    // console.log(`ariaAttributes`, ariaAttributes)

    setAriaErrorAttributes(ariaAttributes)
  }, [errors[fieldId]])

  // errors[fieldId]

  return (
    <>
      <input
        {...register(fieldId, registerOptions || {})}
        type={type}
        id={fieldId}
        disabled={disabled || readonly}
        name={fieldId}
        className={cn(
          'block px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm',
          {
            'pr-10 border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500':
              errors[fieldId],
          },
          { 'w-full': type !== 'checkbox' },
          className,
        )}
        {...ariaErrorAttributes}
        {...props}
      >
        {children}
      </input>

      <FormError fieldId={fieldId} errors={errors} />
    </>
  )
}

export default Input
