import { ListBox } from '@components'
import { useCodeList } from '@core/code-list.provider'
import React, { useEffect, useState } from 'react'

const noop = () => {}

interface CodeListBoxProps extends React.SelectHTMLAttributes<any> {
  value: string
  listName?: string
  onChange?: (evt: React.ChangeEvent<HTMLSelectElement>) => any
  invert?: boolean
}

export const CodeListBox = function CodeListBox({ listName, value, onChange, id, ...props }: CodeListBoxProps) {
  const [{ data, loading, error, getDropdownValues }] = useCodeList()
  const [myOptions, setMyOptions] = useState(getDropdownValues(data, listName!))

  useEffect(() => {
    const newOptions = getDropdownValues(data, listName!)
    // console.log('options :>> ', newOptions)
    setMyOptions(newOptions)
  }, [data])

  if (loading) {
    return <div>loading</div>
  }
  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }
  if (listName && (!data[listName] || !data[listName].items.length)) {
    return (
      <div className="">
        Something went wrong trying to load list {listName}: {JSON.stringify(data[listName])}
      </div>
    )
  }

  return <ListBox {...props} value={value} options={myOptions} onChange={onChange || noop} />
}
