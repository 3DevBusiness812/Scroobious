// Global State Management
// https://github.com/dai-shi/react-tracked
import { ApolloError, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { createContainer } from 'react-tracked'
import { ListObject, LISTS_QUERY, toObject } from './lists'

const LIST_NAMES = [
  'accreditation_status',
  'company_role',
  'company_stage',
  'corporate_structure',
  'country',
  'disability',
  'ethnicity',
  'funding_status',
  'gender',
  'industry',
  'investor_type',
  'perk_category',
  'presentation_status',
  'pronoun',
  'revenue',
  'sexual_orientation',
  'state_province',
  'suggested_resource_category',
  'transgender',
  'working_status',
  'criteria',
]

function getList(lists: ListObject, listName: string) {
  return lists[listName]
}

function getDropdownValues(lists: ListObject, listName: string) {
  // console.log('getDropdownValues', listName, JSON.stringify(lists))

  const list = getList(lists, listName)
  if (!list || !list.items) {
    return []
  }

  return list.items.map((item) => {
    return {
      label: item.description,
      value: item.id,
    }
  })
}

function getListItem(lists: ListObject, listName: string, itemId: string) {
  const list = getList(lists, listName)
  if (!list) {
    // console.log(`List ${listName} has not loaded yet.  Trying to find ${itemId}`)
    return { description: '' }
    // throw `Couldn't find list ${listName}`
  }

  return list.items.find((entry) => {
    return entry.id === itemId
  })
}

function getListItemValue(lists: ListObject, listName: string, itemId?: string | null) {
  if (!itemId) {
    // console.log(`Item ID blank while looking up list item value: ${listName}`)
    return ''
  }
  return getListItem(lists, listName, itemId)?.description
}

const innerUseCodeLists = () => {
  const [hookLoading, setHookLoading] = useState(true)
  const [hookData, setHookData] = useState({} as ListObject)
  const [hookError, setHookError] = useState<ApolloError | undefined>(undefined)
  const { loading, error, data } = useQuery(LISTS_QUERY, {
    variables: {
      where: {
        listName_in: LIST_NAMES,
      },
    },
  })

  useEffect(() => {
    if (data && data.lists) {
      // console.log('data.lists')
      // console.log('data.lists :>> ', data.lists)
      // console.log('Setting hook data :>> ', toObject(data.lists))
      setHookData(toObject(data.lists))
    } else {
      // console.log('useEffect failed to update setHookData', data)
    }
  }, [data])

  useEffect(() => {
    setHookLoading(loading)
  }, [loading])

  useEffect(() => {
    setHookError(error)
  }, [error])

  function noop() {}

  return [
    {
      data: hookData,
      loading: hookLoading,
      error: hookError,
      getList,
      getListItem,
      getDropdownValues,
      getListItemValue,
    },
    noop,
  ] as const
}

const { Provider: CodeListProvider, useTracked: useCodeList } = createContainer(innerUseCodeLists, true)

export { CodeListProvider, useCodeList }
