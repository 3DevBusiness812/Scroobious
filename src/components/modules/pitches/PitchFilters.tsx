import React from 'react'
import { AiOutlineDollar } from 'react-icons/ai'
import { BiDollar, BiMap } from 'react-icons/bi'
import { BsGrid, BsListTask, BsSearch } from 'react-icons/bs'
import { FilterBar, FilterBarConfig } from '../../FilterBar'

const filterConfig: FilterBarConfig = [
  {
    label: 'Industry',
    icon: BsGrid,
    filter: 'industry_eq',
    type: 'CODE_LISTBOX',
    code: 'industry',
  },
  {
    label: 'Location',
    icon: BiMap,
    filter: 'stateProvince_eq',
    type: 'CODE_LISTBOX',
    code: 'stateProvince',
  },
  {
    label: 'Fundraise',
    icon: BiDollar,
    filter: 'fundingStatus_eq',
    type: 'CODE_LISTBOX',
    code: 'fundingStatus',
  },
  {
    label: 'Stage',
    icon: BsListTask,
    filter: 'companyStage_eq',
    type: 'CODE_LISTBOX',
    code: 'companyStage',
  },
  {
    label: 'Revenue',
    icon: AiOutlineDollar,
    filter: 'revenue_eq',
    type: 'CODE_LISTBOX',
    code: 'revenue',
  },
  {
    label: 'Female Leadership',
    filter: 'femaleLeader_eq',
    type: 'CHECKBOX',
    code: 'femaleLeader',
  },
  {
    label: 'Minority Leadership',
    filter: 'minorityLeader_eq',
    type: 'CHECKBOX',
    code: 'minorityLeader',
  },
]

export function PitchFilters() {
  return <FilterBar items={filterConfig} />
}
