import { Pitch, StartupUpdateInput, StartupWhereUniqueInput } from '@binding'
import { Box, HStack, Avatar, VStack, Divider, Text, Flex, ButtonGroup, IconButton } from '@chakra-ui/react'
import { CheckIcon, CloseIcon, ChatIcon } from '@chakra-ui/icons'
import { CodeListField, Card, TextField, SectionHeader, TextareaField, Button, LinkButton } from '@components'
import React, { useEffect, useState } from 'react'
import { PitchVideosPreview } from '@components/modules/founder'
import { FaLinkedin, FaPencilAlt, FaTwitterSquare } from 'react-icons/fa'
import { useCodeList } from '@core/code-list.provider'
import { useForm } from 'react-hook-form'
import { processFormData } from '@core/form'
import { callAPI, handleApolloMutation } from '@core/request'
import { useUser } from '@core/user.provider'

interface FounderProfilePreviewProps {
  pitch: Pitch
  onSave?: (data: object) => any
  onViewPitchDeck?: () => any
}

export async function updateFounderStartup(data: StartupUpdateInput, where: StartupWhereUniqueInput) {
  return callAPI<any>({
    variables: { data, where },
    query: `
      mutation ($data: StartupUpdateInput!, $where: StartupWhereUniqueInput!) {
        updateStartup(data: $data, where: $where) {
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
          tinyDescription
          additionalTeamMembers
        }
      }
    `,
    operationName: 'updateStartup',
  })
}

type InlineEditableFieldProps = {
  defaultValue: any
  EditComponent: any
  onClose: () => any
  onSubmit: () => any
  inlineEdit?: boolean
}

function InlineEditableField({
  defaultValue,
  EditComponent,
  onClose,
  onSubmit,
  inlineEdit = true,
}: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (inlineEdit) {
    return isEditing ? (
      <>
        {EditComponent}
        <ButtonGroup justifyContent="end" size="sm" w="full" spacing={2}>
          <IconButton
            aria-label=""
            icon={<CheckIcon />}
            onClick={() => {
              onSubmit()
              setIsEditing(false)
            }}
          />
          <IconButton
            aria-label=""
            icon={<CloseIcon boxSize={3} />}
            onClick={() => {
              onClose()
              setIsEditing(false)
            }}
          />
        </ButtonGroup>
      </>
    ) : (
      <>
        {defaultValue}
        <Flex justifyContent="end">
          <FaPencilAlt
            className="text-gray-500 cursor-pointer"
            onClick={() => {
              setIsEditing(true)
            }}
          />
        </Flex>
      </>
    )
  }

  return <>{defaultValue}</>
}

export function FounderProfilePreview({ pitch, onSave, onViewPitchDeck }: FounderProfilePreviewProps) {
  const [{ data, getListItemValue, loading }] = useCodeList()
  const [{ data: userData }] = useUser()

  const {
    register,
    reset,
    formState,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    control,
    getValues,
    setValue,
  } = useForm()

  useEffect(() => {
    if (!loading) {
      closeAndReset()
    }
  }, [loading])

  const userCapabilities = userData?.user?.capabilities
  const userType: 'FOUNDER_LITE' | 'FOUNDER_MEDIUM' | 'FOUNDER_FULL' | 'INVESTOR' | 'ADMIN' | 'REVIEWER' =
    (userCapabilities && userCapabilities[0]) as any

  const founderView = ['FOUNDER_LITE', 'FOUNDER_MEDIUM', 'FOUNDER_FULL'].includes(userType)

  const closeAndReset = (defaultData: any = {}) => {
    const formData = Object.keys(defaultData).length ? defaultData : pitch.organization.startup

    reset({
      ...formData,
      industries: (formData?.industries || []).map((industry: string) => ({
        label: getListItemValue(data, 'industry', industry),
        value: industry,
      })),
    })
  }

  const onSubmit = async (formData: any) => {
    const processedData = processFormData<any>(formData)

    const result = await handleApolloMutation(
      updateFounderStartup(processedData, { id: pitch.organization.startup.id }),
    )

    if (!result.errors) {
      closeAndReset(processedData)
      return onSave && result && onSave(result)
    }

    // Now handle errors
    Object.keys(result.errors).forEach((key: string) => {
      setError(key, { message: result.errors[key] })
    })

    // // If any global errors were added, clear them out so the user can try again
    setTimeout(() => {
      clearErrors('global')
    }, 5000)

    return false
  }

  const pitchDeck = founderView ? pitch.latestPitchDeck : pitch.activePitchDeck

  const content = () => (
    <HStack flexGrow={1} alignItems="flex-start" width="100%">
      <VStack width="50%" mb={4} mr={2}>
        <Card className="" title={founderView ? pitch.organization.startup.name! : undefined}>
          <PitchVideosPreview
            pitch={pitch}
            {...{
              uploadShortVideoUrl: founderView ? '/founder/pitches/upload-pitch-short-video' : undefined,
              uploadExtendedVideoUrl: founderView ? '/founder/pitches/upload-pitch-extended-video' : undefined,
            }}
            investorView={!founderView}
          />

          <div className="w-full">
            {/* <dt className="text-sm font-medium text-gray-500">Short Description</dt> */}
            <dd className="mt-6 text-md text-gray-900">
              <InlineEditableField
                defaultValue={getValues('tinyDescription')}
                onClose={reset}
                onSubmit={handleSubmit(onSubmit)}
                EditComponent={
                  <TextareaField
                    errors={formState.errors}
                    register={register}
                    isRequired
                    fieldId="tinyDescription"
                    registerOptions={{ required: 'You must specify a short company description, under 120 charaters' }}
                  />
                }
                inlineEdit={founderView}
              />
            </dd>
          </div>
          <Box mt={4} mb={8} />
          {pitchDeck?.file?.url && (
            <Button
              variant="none"
              href={founderView || !(!founderView && onViewPitchDeck) ? pitchDeck?.file?.url : undefined}
              onClick={
                !founderView && onViewPitchDeck
                  ? (e: any) => {
                      e.preventDefault()
                      onViewPitchDeck()
                    }
                  : undefined
              }
              className="border-orange-400/25 bg-orange-400/25 font-bold bg-orange-400 text-white bg-orange-400 w-full"
            >
              View Pitch Deck
            </Button>
          )}

          <div className="w-full mt-6">
            <dt className="text-sm font-medium text-gray-500">Additional Information</dt>
            <dd className="mt-1 text-sm text-gray-900">
            <InlineEditableField
              defaultValue={getValues('shortDescription')}
              onClose={reset}
              onSubmit={handleSubmit(onSubmit)}
              EditComponent={
                <TextareaField
                  errors={formState.errors}
                  register={register}
                  isRequired
                  fieldId="shortDescription"
                  registerOptions={{ required: 'You must specify more information describing your company' }}
                />
              }
              inlineEdit={founderView}
            />
            </dd>
          </div>
        </Card>
        <Box className="w-full px-5" />
      </VStack>
      <VStack width="50%">
        <Card title="Company">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Company Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <InlineEditableField
                  defaultValue={getValues('name')}
                  onClose={() => closeAndReset()}
                  onSubmit={handleSubmit(onSubmit)}
                  EditComponent={
                    <TextField
                      errors={formState.errors}
                      register={register}
                      setValue={setValue}
                      required
                      fieldId="name"
                      registerOptions={{ required: 'You must specify company name' }}
                    />
                  }
                  inlineEdit={founderView}
                />{' '}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Industry</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <InlineEditableField
                  defaultValue={(getValues('industries') || [])
                    .map((industry: any) => industry.value)
                    .map((industry: any) => getListItemValue(data, 'industry', industry))
                    .join(' ')}
                  onClose={() => closeAndReset()}
                  onSubmit={handleSubmit(onSubmit)}
                  EditComponent={
                    <CodeListField
                      label=""
                      multiple
                      errors={formState.errors}
                      control={control}
                      listName="industry"
                      required
                      fieldId="industries"
                    />
                  }
                  inlineEdit={founderView}
                />{' '}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Company Website</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <InlineEditableField
                  defaultValue={
                    <a
                      href={`${getValues('website')}`}
                      target="_blank"
                      className="cursor-pointer underline"
                      rel="noreferrer"
                    >
                      {getValues('website')}
                    </a>
                  }
                  onClose={() => closeAndReset()}
                  onSubmit={handleSubmit(onSubmit)}
                  EditComponent={
                    <TextField
                      errors={formState.errors}
                      register={register}
                      setValue={setValue}
                      required
                      fieldId="website"
                      registerOptions={{ required: 'You must specify company website' }}
                    />
                  }
                  inlineEdit={founderView}
                />{' '}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Stage</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <InlineEditableField
                  defaultValue={getListItemValue(data, 'companyStage', getValues('companyStage'))}
                  onClose={() => closeAndReset()}
                  onSubmit={handleSubmit(onSubmit)}
                  EditComponent={
                    <CodeListField
                      label=""
                      errors={formState.errors}
                      control={control}
                      listName="companyStage"
                      required
                      fieldId="companyStage"
                    />
                  }
                  inlineEdit={founderView}
                />
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <InlineEditableField
                  defaultValue={getListItemValue(data, 'stateProvince', getValues('stateProvince'))}
                  onClose={reset}
                  onSubmit={handleSubmit(onSubmit)}
                  EditComponent={
                    <CodeListField
                      label=""
                      errors={formState.errors}
                      control={control}
                      listName="stateProvince"
                      required
                      fieldId="stateProvince"
                    />
                  }
                  inlineEdit={founderView}
                />
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Revenue</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <InlineEditableField
                  defaultValue={getListItemValue(data, 'revenue', getValues('revenue'))}
                  onClose={reset}
                  onSubmit={handleSubmit(onSubmit)}
                  EditComponent={
                    <CodeListField
                      label=""
                      errors={formState.errors}
                      control={control}
                      listName="revenue"
                      required
                      fieldId="revenue"
                    />
                  }
                  inlineEdit={founderView}
                />
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Company Structure</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <InlineEditableField
                  defaultValue={getListItemValue(data, 'corporateStructure', getValues('corporateStructure'))}
                  onClose={() => closeAndReset()}
                  onSubmit={handleSubmit(onSubmit)}
                  EditComponent={
                    <CodeListField
                      label=""
                      errors={formState.errors}
                      control={control}
                      listName="corporateStructure"
                      required
                      fieldId="corporateStructure"
                    />
                  }
                  inlineEdit={founderView}
                />
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Funding Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <InlineEditableField
                  defaultValue={getListItemValue(data, 'fundingStatus', getValues('fundraiseStatus'))}
                  onClose={reset}
                  onSubmit={handleSubmit(onSubmit)}
                  EditComponent={
                    <CodeListField
                      label=""
                      errors={formState.errors}
                      control={control}
                      listName="fundingStatus"
                      required
                      fieldId="fundraiseStatus"
                    />
                  }
                  inlineEdit={founderView}
                />
              </dd>
            </div>
          </dl>
          <Box mt={8} mb={4}>
            <Divider />
          </Box>

          {pitch.user && (
            <Box bgColor="white" width="100%">
              <SectionHeader title="Founder" />

              <HStack p={2} w="100%" mt={4} bgColor="gray.50" justifyContent="space-between">
                <HStack alignItems="center" spacing={4}>
                  {pitch.user.profilePictureFile && pitch.user.profilePictureFile.url && (
                    <Avatar name={pitch.user.name} src={pitch.user.profilePictureFile.url} />
                  )}
                  <VStack alignItems="flex-start">
                    <Text className="text-base font-medium">{pitch.user.name}</Text>
                  </VStack>
                </HStack>
              </HStack>

              <HStack mt={5} spacing={4}>
                <LinkButton
                  href={`/messages?recipientId=${pitch.user.id}`}
                  buttonProps={{
                    variant: 'outline',
                    bgColor: 'white',
                    textColor: 'primary.400',
                    leftIcon: <ChatIcon className="w-6" />,
                  }}
                >
                  Send Message
                </LinkButton>

                {pitch.user?.founderProfile?.linkedinUrl && (
                  <LinkButton
                    href="#"
                    buttonProps={{
                      onClick: () => {
                        // @ts-ignore
                        window.open(pitch.user.founderProfile.linkedinUrl, '_blank')
                      },
                      variant: 'outline',
                      bgColor: 'white',
                      textColor: 'primary.400',
                      leftIcon: <FaLinkedin className="w-6" />,
                    }}
                  >
                    LinkedIn
                  </LinkButton>
                )}

                {pitch.user?.founderProfile?.twitterUrl && (
                  <LinkButton
                    href="#"
                    buttonProps={{
                      onClick: () => {
                        // @ts-ignore
                        window.open(pitch.user.founderProfile.twitterUrl, '_blank')
                      },
                      variant: 'outline',
                      bgColor: 'white',
                      textColor: 'primary.400',
                      leftIcon: <FaTwitterSquare className="w-6" />,
                    }}
                  >
                    Twitter
                  </LinkButton>
                )}
              </HStack>

              <div className="w-full mt-6">
                <dt className="text-sm font-medium text-gray-500">Origin Story</dt>
                <dd className="mt-1 text-sm text-gray-900">
                <InlineEditableField
                  defaultValue={getValues('originStory')}
                  onClose={reset}
                  onSubmit={handleSubmit(onSubmit)}
                  EditComponent={
                    <TextareaField
                      errors={formState.errors}
                      register={register}
                      isRequired
                      fieldId="originStory"
                      registerOptions={{ required: 'You must specify an origin story' }}
                    />
                  }
                  inlineEdit={founderView}
                />
                </dd>
              </div>
            </Box>
          )}
        </Card>
      </VStack>
    </HStack>
  )

  return <Card className="mb-4 flex-1 mr-4">{founderView ? <form noValidate>{content()}</form> : content()}</Card>
}
