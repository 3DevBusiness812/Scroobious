import { FounderProfileCreateInput, User } from '@binding'
import { Box, Flex, HStack, Spacer, Avatar } from '@chakra-ui/react'
import { useAlert } from '@core/alert.provider'
import { Alert, ButtonSubmit, CodeListField, InputURL, TextField, FileUpload } from '@components'
import { FILE_TYPE_ACCEPT } from '@core/file-type'
import { processFormData } from '@core/form'
import { handleApolloMutation } from '@core/request'
import { createFounderProfile } from '@src/modules/founder/founder-profile.mutation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { updateUser } from '@src/auth/update-user.mutation'
import { useSession } from 'next-auth/client'
import { uploadedAvatar } from '@src/pages/account-settings'



interface OnboardingFounderProfileFormProps {
  onSave: (data: object) => any
}

export function OnboardingFounderProfileForm({ onSave }: OnboardingFounderProfileFormProps) {
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
  const { setAlert } = useAlert()

 const userSess = useSession();

  const handleSuccessfulUpload = async (data: any) => {
    const user = userSess[0]?.user
    try {
      setAlert({ isHide: true })
      const imgData = { profilePictureFileId: data}
      await updateUser(imgData, {
        email: user?.email
      });
      setAlert({
        type: 'notification',
        message: 'Succesfully Updated Profile',
        status: 'success',
      });
      uploadedAvatar.value = data;
    } catch (error) {
      setAlert({
        type: 'notification',
        message: 'Unable to update profile. Please notify support',
        status: 'error',
      })
    }
  }
  const onSubmit = async (data: any) => {
    console.log('data :>> ', data);
    delete data.profilePictureFileId;
  
    const processedData = processFormData<FounderProfileCreateInput>(data)
    const result = await handleApolloMutation(createFounderProfile(processedData))
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

  return (<>
    <Box>
    <FileUpload
            accept={FILE_TYPE_ACCEPT.image}
            label="Upload a Profile Picture (Optional)"
            buttonLabel="Upload Picture"
            errors={errors}
            register={register}
            setValue={setValue}
            initialFileUrl={userSess[0]?.user?.image}
            fieldId="profilePictureFileId"
            onSuccess={handleSuccessfulUpload}
        />
    </Box>
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {errors.global && errors.global.message && (
        <Alert status="error" className="-mt-18 mb-4">
          {errors.global.message}
        </Alert>
      )}

      {/* TODO: Add hint text to all of the "Fields" */}
      <HStack flex={1} align="flex-start">
        <Box className="w-full space-y-5 sm:mr-4">
          <CodeListField
            multiple
            label="Race/Ethnicity"
            errors={formState.errors}
            control={control}
            listName="ethnicity"
            required
            fieldId="ethnicities"
          />
          <CodeListField
            label="What are your preferred pronouns?"
            errors={formState.errors}
            control={control}
            listName="pronoun"
            required
            fieldId="pronouns"
          />

          <InputURL
            label="LinkedIn URL"
            fieldId="linkedinUrl"
            errors={formState.errors}
            register={register}
            isRequired
            icon="linkedIn"
            setValue={setValue}
            registerOptions={{ required: 'You must specify LinkedIn URL' }}
          />
        </Box>
        <Box className="w-full space-y-5 sm:mr-4">
          <CodeListField
            label="Gender"
            errors={formState.errors}
            control={control}
            listName="gender"
            required
            fieldId="gender"
          />
          <CodeListField
            label="Location"
            errors={formState.errors}
            control={control}
            listName="stateProvince"
            required
            fieldId="stateProvince"
          />
          <InputURL
            label="Twitter URL"
            fieldId="twitterUrl"
            errors={formState.errors}
            register={register}
            icon="twittes"
            setValue={setValue}
          />
          <TextField
            label="How did you hear about Scroobious?"
            fieldId="source"
            errors={formState.errors}
            register={register}
            isRequired
            setValue={setValue}
            registerOptions={{ required: 'You must specify "How did you hear about Scroobious"' }}
          />
        </Box>
      </HStack>
      <Flex className="mt-6">
        <Spacer />
        <ButtonSubmit width="240px" label="Next" />
      </Flex>
    </form>
    </>
  )
}
