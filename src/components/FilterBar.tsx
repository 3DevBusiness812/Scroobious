import { Checkbox, Input } from '@chakra-ui/react'
import { CodeListBox, ListBox } from '@components'
// @ts-ignore
import * as debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { FilterBarItem } from './FilterBarItem'
import { FilterItemBase } from './FilterItemBase'
import { Option } from './forms'

type CodeListItem = FilterItemBase & {
  type: 'CODE_LISTBOX'
}

type SelectItem = FilterItemBase & {
  type: 'SELECT'
  options: Option[]
}

type CheckboxItem = FilterItemBase & {
  type: 'CHECKBOX'
}

type SearchItem = FilterItemBase & {
  type: 'SEARCH'
}

export type FilterBarConfig = Array<CodeListItem | SelectItem | CheckboxItem | SearchItem>

interface FilterBarProps {
  items: FilterBarConfig
}

export function FilterBar({ items }: FilterBarProps) {
  const router = useRouter()
  const [filters, udpateFilters] = useState<any>(router.query)

  const onChange = useCallback(
    (filterId: string, value: string | null) => {
      const updatedQueryString = { ...router.query }

      if (value) {
        updatedQueryString[filterId] = value
      } else {
        delete updatedQueryString[filterId]
      }

      // console.log('updatedQueryString :>> ', updatedQueryString)

      udpateFilters(updatedQueryString)

      router.push({
        pathname: router.pathname,
        query: updatedQueryString,
      })
    },
    [router.query],
  )

  const onChangeOption = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      // console.log('evt :>> ', evt)
      const { value } = evt.target
      const filterId = evt.target.getAttribute('data-filter') as string

      return onChange(filterId, value)
    },
    [router.query],
  )

  const onChangeCheckbox = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      // console.log('evt :>> ', evt)
      const code = evt.target.id
      const value = evt.target.checked ? 'true' : null
      const filterId = `${code}_eq`

      return onChange(filterId, value)
    },
    [router.query],
  )

  const onChangeSearch = useCallback(
    debounce((evt: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      // console.log('evt :>> ', evt)
      const { value } = evt.target
      const filterId = evt.target.getAttribute('data-filter') as string

      // console.log('filterId, value :>> ', filterId, value)

      return onChange(filterId, value)
    }, 300),
    [router.query],
  )

  return (
    <>
      {items.map((item) => {
        switch (item.type) {
          case 'CHECKBOX':
            return (
              <FilterBarItem key={item.code} item={item}>
                <Checkbox
                  id={item.code}
                  colorScheme="orange"
                  isChecked={filters[item.filter] === 'true'}
                  value={filters[item.filter]}
                  onChange={onChangeCheckbox}
                />
              </FilterBarItem>
            )
            break

          case 'CODE_LISTBOX':
            return (
              <FilterBarItem key={item.code} item={item}>
                <CodeListBox
                  id={item.code}
                  value={filters[item.filter]}
                  data-filter={item.filter}
                  listName={item.code}
                  onChange={onChangeOption}
                  invert
                />
              </FilterBarItem>
            )
            break

          case 'SELECT':
            return (
              <FilterBarItem key={item.code} item={item}>
                <ListBox
                  value={filters[item.filter]}
                  data-filter={item.filter}
                  options={item.options || []}
                  onChange={onChangeOption}
                  invert
                />
              </FilterBarItem>
            )
            break

          case 'SEARCH':
            return (
              <FilterBarItem key={item.code} item={item}>
                <Input
                  id={item.code}
                  color="black"
                  backgroundColor="white"
                  variant="outline"
                  data-filter={item.filter}
                  onChange={onChangeSearch}
                />
              </FilterBarItem>
            )
            break

          default:
            return <></>
        }
      })}
    </>
  )
}
