import { usePermissions } from '@core/user.provider'
import React from 'react'

interface PermissionGateProps {
  p: string | string[] // shorthand
  children: React.ReactNode
}

export function PermissionGate({ children, p }: PermissionGateProps) {
  const [{ data, error, loading: permissionsLoading, hasPermission }] = usePermissions()

  // PERFORMANCE: compute this once instead of each time this renders
  const requiredPermissionSet = new Set(Array.isArray(p) ? p : [p])
  const userPermissionSet = new Set(data.permissions)
  let intersection = new Set([...requiredPermissionSet].filter((x) => userPermissionSet.has(x)))

  return <>{intersection.size ? children : null}</>
}
