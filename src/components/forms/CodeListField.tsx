// Thank you @csandman!
// https://gist.github.com/csandman/c687a9fb4275112f281ab9a5701457e4
// https://codesandbox.io/s/chakra-ui-react-select-648uv?file=/chakra-react-select.js
import { SelectField, SelectFieldProps } from '@components'
import { useCodeList } from '@core/code-list.provider'
import React from 'react'

interface SelectCodeListProps extends Omit<SelectFieldProps, 'options'> {
  listName: string // TODO: should type listName
}

export function CodeListField(props: SelectCodeListProps) {
  const [{ data, error, loading, getDropdownValues }] = useCodeList()
  const { listName, ...rest } = props

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  let options: any[] = []
  if (!loading && data && data[listName]) {
    options = getDropdownValues(data, listName)
  }

  return <SelectField {...rest} options={options} />
}
