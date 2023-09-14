/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { gql } from '@apollo/client'
import { User } from '@binding'
import { Box, HStack, VStack, TabPanel, TabPanels, Tab, Tabs, TabList } from '@chakra-ui/react'
import { AppNavigation, ButtonSubmit, FileUpload, InputField } from '@components'
import { processFormData } from '@core/form'
import { ManageSubscriptionButton } from '@components/modules/auth'
import { initServerSideClient } from '@core/apollo'
import { FILE_TYPE_ACCEPT } from '@core/file-type'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { updateUser } from '@src/auth/update-user.mutation'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import InvestorProfileForm from '@components/modules/account-settings/InvestorProfileForm'
import FounderProfileForm from '@components/modules/account-settings/FounderProfileForm'
import { useAlert } from '@core/alert.provider'
import { signal } from '@preact/signals-core'

export const uploadedAvatar = signal('')

export interface AccountSettingsProps {
  user: User
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { setAlert } = useAlert()
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    handleSubmit,
  } = useForm()

  useEffect(() => {
    setValue('name', user.name)
    setIsLoading(false)
  }, [])

  const onSubmit = async (data: any) => {
    try {
      setAlert({ isHide: true })
      setIsLoading(true)
      const processedData = processFormData<any>(data)
      await updateUser(processedData, {
        id: user.id,
      })

      uploadedAvatar.value = processedData.profilePictureFileId

      setAlert({
        type: 'notification',
        message: 'Succesfully Updated Profile',
        status: 'success',
      })
    } catch (error) {
      setAlert({
        type: 'notification',
        message: 'Unable to update profile. Please notify support',
        status: 'error',
      })
    } finally {
      // Leave setTimeout so that loader lasts at least 1/2 second. Otherwise it flickers.
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }
  const success = (data: any) => {
    setTimeout(() => {
      handleSubmit(onSubmit)()
    }, 1000)
  }

  return (
    <AppNavigation isLoading={isLoading}>
      <Head>
        <title>Account Settings</title>
      </Head>
      <VStack flex={1} width="100%" justifyContent="flex-start" px={4}>
        <HStack flexGrow={1} p={4} justifyContent="center" alignItems="top" width="100%">
          <Box bgColor="white" width="50%" pb={6}>
            <VStack spacing={6}>
              <Box mt={5} className="w-96" mb={6}>
                <Tabs variant="unstyled" defaultIndex={0}>
                  <TabList
                    borderBottomWidth={4}
                    borderBottomColor="green.300"
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Tab _selected={{ color: 'white', bg: 'green.300' }} fontWeight="bold">
                      Account
                    </Tab>
                    <Tab _selected={{ color: 'white', bg: 'green.300' }} fontWeight="bold">
                      Profile
                    </Tab>
                    <Tab _selected={{ color: 'white', bg: 'green.300' }} fontWeight="bold">
                      Subscription
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
                        <VStack alignItems="flex-start" w="100%">
                          <FileUpload
                            accept={FILE_TYPE_ACCEPT.image}
                            label="Profile Picture"
                            buttonLabel="Upload Picture"
                            errors={errors}
                            initialFileUrl={uploadedAvatar.value || user.profilePictureFile.url}
                            register={register}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            required
                            fieldId="profilePictureFileId"
                            displayImage
                            onSuccess={success}
                          />
                          <InputField label="Full Name" fieldId="name" errors={errors} register={register} />
                          <ButtonSubmit w="full" label="Save" />

                          {saveSuccess && <div>Save Successful</div>}
                        </VStack>
                      </form>
                    </TabPanel>
                    <TabPanel>
                      {user.investorProfile && <InvestorProfileForm setSaveSuccess={setSaveSuccess} user={user} />}
                      {user.founderProfile && <FounderProfileForm setAlert={setAlert} setIsLoading={setIsLoading} setSaveSuccess={setSaveSuccess} user={user} />}
                    </TabPanel>
                    <TabPanel>
                      <Box mb={4} textAlign="center">
                        <ManageSubscriptionButton title="Manage Subscription" buttonProps={{ colorScheme: 'gray' }} />
                      </Box>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </VStack>
          </Box>
        </HStack>
      </VStack>
    </AppNavigation>
  )
}

const FIND_ONE_QUERY = gql`
  query user($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      name
      email
      capabilities
      profilePictureFile {
        id
        url
      }
      createdAt
    }
  }
`

const FIND_INVESTOR_QUERY = gql`
  query user($where: UserWhereUniqueInput!) {
    user(where: $where) {
      investorProfile {
        userId
        accreditationStatuses
        linkedinUrl
        investorTypes
        thesis
        criteria
        ethnicities
        gender
        pronouns
        industries
        demographics
        stateProvince
        companyStages
        fundingStatuses
        revenues
        source
      }
    }
  }
`

const FIND_FOUNDER_QUERY = gql`
  query user($where: UserWhereUniqueInput!) {
    user(where: $where) {
      founderProfile {
        id
        stateProvince
        twitterUrl
        linkedinUrl
        ethnicities
        gender
        sexualOrientation
        transgender
        disability
        companyRoles
        workingStatus
        pronouns
        source
        bubbleLocation
        fundingStatus
        industry
        companyStage
        presentationStatus
      }
    }
  }
`

export type PerkQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect<AccountSettingsProps>(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    const client = initServerSideClient(context)
    const userId = session.user.id

    let investorProfile = null
    let founderProfile = null

    const variables = {
      where: {
        id: userId,
      },
    }

    const payload = await client.query<PerkQuery>({
      query: FIND_ONE_QUERY,
      variables,
    })

    if (payload.data.user.capabilities.includes('INVESTOR')) {
      const investorPayload = await client.query<PerkQuery>({
        query: FIND_INVESTOR_QUERY,
        variables,
      })

      investorProfile = investorPayload.data.user.investorProfile
    }

    if (
      payload.data.user.capabilities.includes('FOUNDER_FULL') ||
      payload.data.user.capabilities.includes('FOUNDER_LITE') ||
      payload.data.user.capabilities.includes('FOUNDER_MEDIUM')
    ) {
      const founderPayload = await client.query<PerkQuery>({
        query: FIND_FOUNDER_QUERY,
        variables,
      })

      founderProfile = founderPayload.data.user.founderProfile
    }

    return {
      props: {
        user: {
          ...payload.data.user,
          investorProfile,
          founderProfile,
        },
      },
    }
  },
)
