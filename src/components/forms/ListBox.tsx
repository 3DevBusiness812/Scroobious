import { Select } from '@chakra-ui/react'
import { themeColors } from '@core/theme-colors'
import React from 'react'

export type Option = { label: string; value: string | number }

interface ListBoxProps extends React.SelectHTMLAttributes<any> {
  value: string
  options: Option[]
  onChange: (evt: React.ChangeEvent<HTMLSelectElement>) => any
  invert?: boolean
}

export function ListBox({ options, value, onChange, invert, size, id, ...props }: ListBoxProps) {
  if (!options || !options.length) {
    return <div>Loading...</div>
  }

  let styleOptions = {}
  if (invert) {
    styleOptions = {
      bg: themeColors.light[900],
      borderColor: themeColors.dark[100],
      color: 'black',
    }
  } else {
    styleOptions = {
      bg: 'white',
      borderColor: 'white',
      color: themeColors.tertiary[800],
    }
  }

  return (
    <Select {...styleOptions} size="sm" {...props} value={value} placeholder="- ALL -" onChange={onChange}>
      {options.map((option, index) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>

    // <div className="w-full mb-5">
    //   <Listbox value={selected} onChange={onChangeListbox}>
    //     <div className="relative mt-1">
    //       <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
    //         <span className="block truncate">{selected.name}</span>
    //         <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
    //           <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
    //         </span>
    //       </Listbox.Button>
    //       <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
    //         <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
    //           {listItems.map((option, index) => (
    //             <Listbox.Option
    //               key={index}
    //               className={({ active }) =>
    //                 `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
    //                       cursor-default select-none relative py-2 pl-10 pr-4`
    //               }
    //               value={option}
    //               onChange={handleChange}
    //             >
    //               {({ selected, active }) => (
    //                 <>
    //                   <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
    //                     {option.name}
    //                   </span>
    //                   {selected ? (
    //                     <span
    //                       className={`${active ? 'text-amber-600' : 'text-amber-600'}
    //                             absolute inset-y-0 left-0 flex items-center pl-3`}
    //                     >
    //                       <CheckIcon className="w-5 h-5" aria-hidden="true" />
    //                     </span>
    //                   ) : null}
    //                 </>
    //               )}
    //             </Listbox.Option>
    //           ))}
    //         </Listbox.Options>
    //       </Transition>
    //     </div>
    //   </Listbox>
    // </div>
  )
}

export default ListBox
