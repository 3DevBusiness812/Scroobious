import React, { useEffect } from 'react'
import { CodeListField, TextField, InputURL, ButtonSubmit } from '@components'
import { processFormData } from '@core/form'
import { VStack } from '@chakra-ui/react'
import { User } from '@binding'
import { useForm } from 'react-hook-form'
import { updateFounderProfile } from '@src/auth/founder-profile.mutation'
import { useCodeList } from '@core/code-list.provider'
import { getDefaultValues } from './accountUtils'

interface IFounderProfileForm {
  setSaveSuccess: (param: boolean) => void
  user: User
  setIsLoading: (param: boolean) => void
  setAlert: any
}

const FounderProfileForm = ({ setSaveSuccess, user, setIsLoading, setAlert }: IFounderProfileForm) => {
  const [{ data, getDropdownValues, loading }] = useCodeList()
  const founderProfile = user?.founderProfile

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
        origData: founderProfile,
        keyMap: {
          ethnicities: 'ethnicity',
          pronoun: 'pronouns',
          companyRoles: 'companyRoles',
          industry: 'industry',
        },
      })
      Object.keys(defaultValues).forEach((key: string) => {
        setValue(key, defaultValues[key])
      })
    }
  }, [loading, setValue, getDropdownValues, data, user, founderProfile])
  const onSubmit = async (updateData: any) => {
    const processedData = processFormData<any>(updateData)
    try {
      setIsLoading(true)
      const updatedProfileData = await updateFounderProfile(processedData, { id: founderProfile.id })
      if (Object.keys(updatedProfileData)[0].toString() === 'errors') {
        throw new Error(updatedProfileData)
      }
      setSaveSuccess(true)
      setAlert({
        type: 'notification',
        message: 'Succesfully Updated Profile...',
        status: 'success',
      })

      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (err) {
      setSaveSuccess(false)
      setIsLoading(false)
      setAlert({
        type: 'notification',
        message: 'Error: Unable to Updated Profile',
        status: 'warning',
      })
    }
    setTimeout(() => {
      setSaveSuccess(false)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
      <VStack alignItems="flex-start" w="100%">
        <CodeListField
          listName="ethnicity"
          fieldId="ethnicities"
          multiple
          label="Race/Ethnicity"
          errors={errors}
          control={control}
          required
        />
        <CodeListField
          label="What are your preferred pronouns?"
          errors={errors}
          control={control}
          listName="pronoun"
          required
          fieldId="pronouns"
        />
        <InputURL
          label="LinkedIn URL"
          fieldId="linkedinUrl"
          errors={errors}
          register={register}
          isRequired
          icon="linkedIn"
          setValue={setValue}
          registerOptions={{ required: 'You must specify LinkedIn URL' }}
        />
        <CodeListField
          label="Gender"
          errors={errors}
          control={control}
          listName="gender"
          required
          fieldId="gender"
          multiple={false}
        />
        <CodeListField
          label="Funding Status"
          errors={errors}
          control={control}
          listName="fundingStatus"
          required
          fieldId="fundingStatus"
          multiple={false}
        />
        <CodeListField
          label="Transgender"
          errors={errors}
          control={control}
          listName="transgender"
          fieldId="transgender"
          multiple={false}
          required
        />
        <CodeListField
          label="Disabilty"
          errors={errors}
          control={control}
          listName="disability"
          required
          fieldId="disability"
          multiple={false}
        />
        <CodeListField
          label="Company Stage"
          errors={errors}
          control={control}
          listName="companyStage"
          required
          fieldId="companyStage"
          multiple={false}
        />
        <CodeListField
          label="Industry"
          errors={errors}
          control={control}
          listName="industry"
          required
          fieldId="industry"
          multiple
        />
        <CodeListField
          label="Location"
          errors={errors}
          control={control}
          listName="stateProvince"
          required
          fieldId="stateProvince"
        />
        <InputURL
          label="Twitter URL"
          fieldId="twitterUrl"
          errors={errors}
          register={register}
          icon="twittes"
          setValue={setValue}
        />
        <CodeListField
          label="Have you presented your pitch before?"
          errors={errors}
          control={control}
          listName="presentationStatus"
          required
          fieldId="presentationStatus"
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
export default FounderProfileForm
