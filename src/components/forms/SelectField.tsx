/* eslint-disable no-param-reassign */
import { FormLabel } from '@chakra-ui/react'
import { Select } from '@components'
import React from 'react'
import { Control, Controller, FieldErrors, RegisterOptions } from 'react-hook-form'
import { FormError } from './FormError'

type Option = { label: string; value: string | number }
export interface SelectFieldProps extends React.HTMLAttributes<HTMLInputElement> {
  labelClassName?: string
  label: string
  fieldId: string
  control: Control
  multiple?: boolean
  options: Option[]
  required?: boolean
  inputClassName?: string
  errors: FieldErrors
  registerOptions?: RegisterOptions
}

export function SelectField({
  fieldId,
  label,
  control,
  options,
  required,
  multiple,
  registerOptions,
  errors,
  inputClassName,
}: SelectFieldProps) {
  const regOptions = { ...registerOptions }
  // Required shortcut
  if (required) {
    regOptions.required = `You must specify ${label}`
  }

  return (
    <div className="w-full">
      {label && <FormLabel htmlFor={fieldId}>{label}</FormLabel>}

      <div className={inputClassName}>
        <Controller
          name={fieldId}
          control={control}
          rules={regOptions}
          render={({ field: { onChange, onBlur, value, name } }) => {
            // The first time a value is passed in, it will just be the string value.
            // Out select component expects {value: "VALUE", label: "My Value"}
            // So we need to transfrom the first time
            if (typeof value === 'string' || typeof value === 'number') {
              const option = options.find((optionObj) => optionObj.value === value)
              value = { value, label: option?.label }
            }

            return (
              <Select
                instanceId={fieldId}
                {...{
                  onChange,
                  onBlur,
                  value,
                  name,
                }}
                isDisabled={!options.length}
                isMulti={multiple}
                options={options}
              />
            )
          }}
        />
        <FormError fieldId={fieldId} errors={errors} />
      </div>
    </div>
  )
}
