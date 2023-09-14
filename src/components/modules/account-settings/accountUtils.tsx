import { DropdownEntry } from '@core/form'

interface DefaultValues {
  [key: string]: DropdownEntry[]
}

export const getDefaultValues = ({
  origData,
  keyMap,
  data,
  getDropdownValues,
}: {
  origData: {
    [key: string]: any
  }
  keyMap: {
    [key: string]: string
  }
  data: any
  getDropdownValues: (data: any, listName: string) => DropdownEntry[]
}) => {
  const defaultValues: DefaultValues = {}

  Object.keys(origData).forEach((key: string) => {
    if (key === 'userId') {
      return
    }

    if (Object.keys(keyMap).includes(key)) {
      const options: DropdownEntry[] = getDropdownValues(data, keyMap[key])
      defaultValues[key] = options.filter((optionObj: DropdownEntry) => origData[key]?.includes(optionObj.value))
    } else {
      defaultValues[key] = origData[key]
    }
  })

  return defaultValues
}
