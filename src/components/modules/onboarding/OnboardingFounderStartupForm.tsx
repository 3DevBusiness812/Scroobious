import { StartupCreateInput } from '@binding'
import { Box, Flex, HStack, Spacer } from '@chakra-ui/react'
import { Alert, ButtonSubmit, CodeListField, TextareaField, TextField } from '@components'
import { processFormData } from '@core/form'
import { callAPI, handleApolloMutation } from '@core/request'
import React from 'react'
import { useForm } from 'react-hook-form'

// TODO: refactor to use useMutation
export async function createStartup(data: StartupCreateInput) {
  return callAPI<any>({
    variables: { data },
    query: `
      mutation ($data: StartupCreateInput!) {
        createStartup(data: $data) {
          id
          organizationId
          name
          website
          corporateStructure
          country
          stateProvince
          fundraiseStatus
          companyStage
          revenue
          industries
          shortDescription
          originStory
          shortDescription
          additionalTeamMembers
          createdAt
        }
      }
    `,
    operationName: 'createStartup',
  })
}

interface OnboardingFounderStartupFormProps {
  onSave: (data: object) => any
}

export function OnboardingFounderStartupForm({ onSave }: OnboardingFounderStartupFormProps) {
  const {
    register,
    formState,
    setError,
    formState: { errors },
    control,
    clearErrors,
    handleSubmit,
    setValue,
  } = useForm()

  const onSubmit = async (data: any) => {
    // console.log('data :>> ', data)

    const processedData = processFormData<StartupCreateInput>(data)
    const result = await handleApolloMutation(createStartup(processedData))

    // console.log('result :>> ', result)

    if (!result.errors) {
      return onSave && result && onSave(result)
    }

    // console.log('Object.keys(result.errors) :>> ', Object.keys(result.errors))
    // Now handle errors
    Object.keys(result.errors).forEach((key: string) => {
      // console.log('key :>> ', key)
      // console.log('message :>> ', result.errors[key])
      setError(key, { message: result.errors[key] })
    })

    // If any global errors were added, clear them out so the user can try again
    setTimeout(() => {
      clearErrors('global')
    }, 5000)

    return false
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {errors.global && errors.global.message && (
        <Alert status="error" className="-mt-18 mb-4">
          {errors.global.message}
        </Alert>
      )}
      {/* TODO: Add hint text to all of the "Fields" */}
      <HStack flex={1} align="flex-start">
        <Box className="w-full space-y-5 sm:mr-4">
          <TextField
            label="Company Name"
            fieldId="name"
            errors={formState.errors}
            register={register}
            isRequired
            setValue={setValue}
            registerOptions={{ required: 'You must specify Company Name' }}
          />
          <CodeListField
            label="State"
            errors={formState.errors}
            control={control}
            listName="stateProvince"
            required
            fieldId="stateProvince"
          />
          <CodeListField
            label="Country"
            errors={formState.errors}
            control={control}
            listName="country"
            required
            fieldId="country"
          />
          <CodeListField
            label="Fundraising"
            errors={formState.errors}
            control={control}
            listName="fundingStatus"
            required
            fieldId="fundraiseStatus"
          />
          <CodeListField
            label="Revenue"
            errors={formState.errors}
            control={control}
            listName="revenue"
            required
            fieldId="revenue"
          />
          <TextareaField
            label="What motivated you to start your company?"
            fieldId="originStory"
            errors={formState.errors}
            register={register}
            isRequired
            registerOptions={{ required: 'You must specify this field' }}
          />
          <TextareaField
            label="What is your biggest business related challenge?"
            fieldId="businessChallenge"
            errors={formState.errors}
            register={register}
            isRequired
            registerOptions={{ required: 'You must specify this field' }}
          />
        </Box>

        <Box className="w-full space-y-5 sm:mr-4">
          <TextField
            label="Website"
            fieldId="website"
            errors={formState.errors}
            register={register}
            required
            setValue={setValue}
          />
          <CodeListField
            label="Industry (select all that apply)"
            multiple
            errors={formState.errors}
            control={control}
            listName="industry"
            required
            fieldId="industries"
          />
          <CodeListField
            label="Corporate Structure"
            errors={formState.errors}
            control={control}
            listName="corporateStructure"
            required
            fieldId="corporateStructure"
          />
          <CodeListField
            label="Company Stage"
            errors={formState.errors}
            control={control}
            listName="companyStage"
            required
            fieldId="companyStage"
          />
          <CodeListField
            label="Have you presented your pitch before?"
            errors={formState.errors}
            control={control}
            listName="presentationStatus"
            required
            fieldId="presentationStatus"
          />
          <TextareaField
            label="Short company description (1-3 lines)"
            fieldId="shortDescription"
            errors={formState.errors}
            register={register}
            isRequired
            registerOptions={{ required: 'You must specify Short company description' }}
          />
          <TextareaField
            label="What kind of additional support do you wish you had?"
            fieldId="desiredSupport"
            errors={formState.errors}
            register={register}
            isRequired
            registerOptions={{ required: 'You must specify this field' }}
          />
          <TextareaField
            label="Is there anything we forgot to ask that you would like to share with us?"
            fieldId="anythingElse"
            errors={formState.errors}
            register={register}
            isRequired
            registerOptions={{ required: 'You must specify this field' }}
          />
        </Box>
      </HStack>
      <Flex className="mt-6">
        <Spacer />
        <ButtonSubmit width="240px" label="Next" />
      </Flex>
    </form>
  )
}
