export type DropdownEntry = {
  value: string
  label: string
}

function isMultiSelectField(item: any): item is DropdownEntry[] {
  return item && Array.isArray(item) && item.length && item[0] && item[0].value && item[0].label
}

function isSingleSelectField(item: any): item is DropdownEntry {
  return item && item.value && item.label
}

export function processFormData<T>(data: any): T {
  // console.log('processFormData data :>> ', data)

  // Multiselect fields are coming back as the full array of {label: 'foo', value: 'bar'}
  // This flattens the multiselects down to an array of the IDs
  const processedData = Object.keys(data).reduce((previousValue, key) => {
    // console.log('key :>> ', key)
    const currentValue = data[key]

    if (key.startsWith('__')) {
      delete previousValue[key] // Delete GraphQL type fields
    } else if (key === 'id') {
      delete previousValue[key] // We won't pass the ID in as form data, it will always be part of the UpdateInput
    } else if (isMultiSelectField(currentValue)) {
      previousValue[key] = currentValue.map((item) => item.value)
    } else if (isSingleSelectField(currentValue)) {
      previousValue[key] = currentValue.value
    } else if (typeof currentValue === 'object' && !Array.isArray(currentValue) && currentValue !== null) {
      delete previousValue[key] // Delete the key if the value is an object (hash)
    }

    return previousValue
  }, data)
  // console.log('processedData :>> ', processedData)
  return processedData as T
}
