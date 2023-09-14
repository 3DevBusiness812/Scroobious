import { ParsedUrlQuery } from 'querystring'

export interface StringMap {
  [key: string]: string
}

export function getSingleQueryParam(query: ParsedUrlQuery, param: string): string | undefined {
  const value = query[param]

  if (typeof value === 'undefined' || !value) {
    return undefined
  }
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}

export function getRequiredSingleQueryParam(query: ParsedUrlQuery, param: string): string {
  const value = getSingleQueryParam(query, param)
  if (!value) {
    throw new Error(`Could not find ${param} in URL: ${JSON.stringify(query, undefined, 2)}`)
  }
  return value
}
