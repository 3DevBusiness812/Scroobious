/* eslint-disable no-console */
import React, { useEffect } from 'react'
import { CodeListField, TextField, TextareaField, ButtonSubmit, InputURL } from '@components'
import { processFormData } from '@core/form'
import { VStack } from '@chakra-ui/react'
import { User } from '@binding'
import { useForm } from 'react-hook-form'
import { updateInvestorProfile } from '@src/auth/investor-profile.mutation'
import { useCodeList } from '@core/code-list.provider'
import { getDefaultValues } from './accountUtils'

interface IInvestorProfileForm {
  setSaveSuccess: (param: boolean) => void
  user: User
}

const InvestorProfileForm = ({ setSaveSuccess, user }: IInvestorProfileForm) => {
  const [{ data, getDropdownValues, loading }] = useCodeList()

  const investorProfile = user?.investorProfile

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    control,
  } = useForm()

  useEffect(() => {
    if (!loading) {
      const defaultValues = getDefaultValues({
        data,
        getDropdownValues,
        origData: investorProfile,
        keyMap: {
          accreditationStatuses: 'accreditationStatus',
          investorTypes: 'investorType',
          industries: 'industry',
          companyStages: 'companyStage',
          criteria: 'criteria',
          fundingStatuses: 'fundingStatus',
          revenues: 'revenue',
        },
      })
      Object.keys(defaultValues).forEach((key: string) => {
        setValue(key, defaultValues[key])
      })
    }
  }, [loading, setValue, getDropdownValues, data, user, investorProfile])

  const onSubmit = async (updateData: any) => {
    try {
      const processedData = processFormData<any>(updateData)
      await updateInvestorProfile(processedData, { userId: investorProfile.userId })

      setSaveSuccess(true)

      setTimeout(() => {
        setSaveSuccess(false)
      }, 5000)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
      <VStack alignItems="flex-start" w="100%">
        <CodeListField
          listName="accreditationStatus"
          fieldId="accreditationStatuses"
          multiple
          label="How are you accredited?"
          inputClassName="mb-6"
          errors={errors}
          control={control}
          required
        />
        <CodeListField
          listName="investorType"
          fieldId="investorTypes"
          multiple
          label="Investor Type"
          inputClassName="mb-6"
          errors={errors}
          control={control}
          required
        />
        <CodeListField
          listName="industry"
          fieldId="industries"
          multiple
          label="In what industries do you like to invest? "
          inputClassName="mb-6"
          errors={errors}
          control={control}
          required
        />
        <CodeListField
          listName="companyStage"
          fieldId="companyStages"
          multiple
          label="What company stage do you prefer? "
          inputClassName="mb-6"
          errors={errors}
          control={control}
          required
        />
        <CodeListField
          listName="stateProvince"
          fieldId="stateProvince"
          label="Where are you located? "
          inputClassName="mb-6"
          errors={errors}
          control={control}
          required
        />
        <CodeListField
          listName="fundingStatus"
          fieldId="fundingStatuses"
          multiple
          label="What fundraise size do you prefer? "
          inputClassName="mb-6"
          errors={errors}
          control={control}
          required
        />
        <CodeListField
          listName="revenue"
          fieldId="revenues"
          multiple
          label="What revenue status do you prefer? "
          inputClassName="mb-6"
          errors={errors}
          control={control}
          required
        />
        <InputURL
          fieldId="linkedinUrl"
          label="LinkedIn URL "
          register={register}
          errors={errors}
          setValue={setValue}
          registerOptions={{
            required: 'You must specify LinkedIn URL',
            pattern: {
              value: /^https:\/\/(www.)?linkedin.com\/in\/.+/,
              message: 'Must be valid LinkedIn URL https://www.linkedin.com/in/<handle>',
            },
          }}
          required
        />
        <TextField
          label="How did you hear about Scroobious?"
          fieldId="source"
          errors={errors}
          register={register}
          isRequired
          setValue={setValue}
          registerOptions={{ required: 'You must specify "How did you hear about Scroobious"' }}
        />
        <ButtonSubmit w="full" label="Save" />
      </VStack>
    </form>
  )
}

export default InvestorProfileForm
