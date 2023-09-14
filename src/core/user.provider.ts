// Global State Management
// https://github.com/dai-shi/react-tracked
import { gql, useQuery } from '@apollo/client'
import { createContainer } from 'react-tracked'

export const PERMISSIONS_QUERY = gql`
  query PermissionsForUser {
    permissionsForUser
  }
`
export type ListsQuery = any // TODO: codegen

function hasPermission(permissions: string[], permission: string) {
  return permissions.indexOf(permission) > -1
}

const innerUsePermissions = () => {
  const { loading, error, data } = useQuery(PERMISSIONS_QUERY)

  function noop() {}

  return [
    {
      data: {
        permissions: data?.permissionsForUser,
      },
      loading,
      error,
      hasPermission,
    },
    noop,
  ] as const
}

const { Provider: PermissionsProvider, useTracked: usePermissions } = createContainer(innerUsePermissions, true)

export { PermissionsProvider, usePermissions }

export const USER_QUERY = gql`
  query UserQuery {
    me {
      id
      status
      capabilities
    }
  }
`
const innerUseUser = () => {
  const { loading, error, data } = useQuery(USER_QUERY)

  function noop() {}

  return [
    {
      data: {
        user: data?.me,
      },
      loading,
      error,
    },
    noop,
  ] as const
}

const { Provider: UserProvider, useTracked: useUser } = createContainer(innerUseUser, true)

export { UserProvider, useUser }
