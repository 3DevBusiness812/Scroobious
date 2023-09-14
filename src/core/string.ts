export const truncate = (input: string | null | undefined, length: number) => {
  if (!input) {
    return ''
  }
  return input.length > length ? `${input.substring(0, length)}...` : input
}

export const snakeCase = require('lodash.snakecase')

export const camelCase = require('lodash.camelcase')
