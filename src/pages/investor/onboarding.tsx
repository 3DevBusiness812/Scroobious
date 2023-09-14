import { InvestorProfileCreateInput } from '@binding'
import { Box, Center, HStack, Text, VStack } from '@chakra-ui/react'
import { ButtonSubmit, CodeListField, InputURL, Logo, TextField } from '@components'
import { processFormData } from '@core/form'
import { protect } from '@core/server'
import { createInvestorProfile } from '@src/auth/investor-profile.mutation'
import { TemplateSplashOnboarding } from '@src/templates/TemplateSplashOnboarding'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form'

export default function OnboardingPage() {
  const { register, formState, setError, control, setValue, handleSubmit } = useForm()
  const router = useRouter()

  const onSubmit = async (data: any) => {
    // console.log('data :>> ', data)
    console.log(formState.errors)
    let result
    try {
      const processedData = processFormData<InvestorProfileCreateInput>(data)

      result = await createInvestorProfile(processedData)
      // console.log('result :>> ', result)

      if (result?.error) {
        return setError('accreditationStatuses', { message: result?.error?.message })
      }

      // Push them to "/" and that route will figure out what to do next
      return await router.push('/')
    } catch (error) {
      console.error('ERROR', error)
    }
  }

  return (
    <TemplateSplashOnboarding>
      <Head>
        <title>Investor Onboarding</title>
      </Head>
      <VStack width="100%" p={4} flex={1}>
        <VStack width="80%">
          <Center className="flex-1 w-64 items-center">
            <Logo />
          </Center>

          <Text fontSize="xl" fontWeight="bold" className=" text-gray-900">
            Tell us about your Investing
          </Text>
        </VStack>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)} noValidate>
          <HStack flex={1} align="flex-start">
            <VStack flex={1} align="flex-start">
              <Box className="sm:mx-auto sm:w-full sm:max-w-lg">
                <Box className="px-4 py-8 bg-white sm:px-10">
                  <CodeListField
                    multiple
                    label="How are you accredited?"
                    inputClassName="mb-6"
                    errors={formState.errors}
                    control={control}
                    listName="accreditationStatus"
                    required
                    fieldId="accreditationStatuses"
                  />
                  <CodeListField
                    multiple
                    label="Investor Type"
                    inputClassName="mb-6"
                    errors={formState.errors}
                    control={control}
                    listName="investorType"
                    required
                    fieldId="investorTypes"
                  />
                  <CodeListField
                    multiple
                    label="In what industries do you like to invest? "
                    inputClassName="mb-6"
                    errors={formState.errors}
                    control={control}
                    listName="industry"
                    required
                    fieldId="industries"
                  />

                  <CodeListField
                    multiple
                    label="What company stage do you prefer? "
                    inputClassName="mb-6"
                    errors={formState.errors}
                    control={control}
                    listName="companyStage"
                    required
                    fieldId="companyStages"
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
              </Box>
            </VStack>

            <VStack flex={1} align="flex-start">
              <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="px-4 py-8 bg-white sm:px-10">
                  <Box className="mb-8">
                    <InputURL
                      label="LinkedIn URL"
                      fieldId="linkedinUrl"
                      isRequired
                      errors={formState.errors}
                      setValue={setValue}
                      register={register}
                      registerOptions={{
                        required: 'You must specify LinkedIn URL',
                        pattern: {
                          value: /^https:\/\/(www.)?linkedin.com\/in\/.+/,
                          message: 'Must be valid LinkedIn URL https://www.linkedin.com/in/<handle>'
                        }
                      }}
                    />
                  </Box>
                  <CodeListField
                    label="Where are you located?"
                    inputClassName="mb-6"
                    errors={formState.errors}
                    control={control}
                    listName="stateProvince"
                    required
                    fieldId="stateProvince"
                  />
                  <CodeListField
                    multiple
                    label="What fundraise size do you prefer?"
                    inputClassName="mb-6"
                    errors={formState.errors}
                    control={control}
                    listName="fundingStatus"
                    required
                    fieldId="fundingStatuses"
                  />
                  <CodeListField
                    multiple
                    label="What revenue status do you prefer?"
                    inputClassName="mb-6"
                    errors={formState.errors}
                    control={control}
                    listName="revenue"
                    required
                    fieldId="revenues"
                  />
                </div>
              </div>
            </VStack>
          </HStack>
          <Center>
            <ButtonSubmit width={250} label="Submit" />
          </Center>
        </form>
      </VStack>
    </TemplateSplashOnboarding>
  )
}

export const getServerSideProps: GetServerSideProps = protect(async () => {
  // Just protecting this from non-logged in users
  return { props: {} }
})
