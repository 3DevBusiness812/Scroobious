import { gql } from '@apollo/client'
import { List } from '@binding'
import { GetServerSidePropsContext } from 'next'
import { initServerSideClient } from './apollo'
import { camelCase, snakeCase } from './string'

export interface ListObject {
  [key: string]: List
}

export const LISTS_QUERY = gql`
  query ListsQuery($where: ListWhereInput!) {
    lists(where: $where) {
      id
      name
      items {
        id
        code
        description
        archived
      }
    }
  }
`
export type ListsQuery = any // TODO: codegen

/*
  Returns:
  {
    investorTypeList: {
        __typename: 'List',
        id: 'accreditation_status',
        items: [ 
            {
                "__typename": "ListItem",
                "archived": false,
                "description": "<description>",
                "id": "1"
            },
        ],
        name: 'accreditation_status'
    }
    // ...
  }
*/

export async function getLists(listNames: string[], context: GetServerSidePropsContext) {
  const client = initServerSideClient(context)
  const payload = await client.query<ListsQuery>({
    query: LISTS_QUERY,
    variables: {
      where: {
        listName_in: listNames.map(snakeCase),
      },
    },
  })
  const listArray = payload.data.lists

  return toObject(listArray)
}

export function toObject(lists: List[]) {
  return lists.reduce(function (previousValue: any, currentValue: any) {
    // The apollo cache did not like that there were items with the same IDs, so we instead create
    // A fake ID on the back end and pass the real ID through the "code" attribute
    const data = findByKey(lists, 'name', currentValue.id)
    // console.log('data :>> ', data)
    const newItems = data.items.map((item: any) => {
      return {
        ...item,
        id: item.code,
      }
    })

    previousValue[camelCase(currentValue.id)] = {
      ...data,
      items: newItems,
    }
    return previousValue
  }, {})
}

function findByKey(arr: any[], key: string, keyValue: string) {
  const arr2 = Array.from(arr)

  // console.log('arr :>> ', arr)
  // console.log('key :>> ', key)
  // console.log('keyValue :>> ', keyValue)
  return arr2.find((value) => {
    // console.log('value :>> ', value)
    return value[key] === keyValue
  })
}
