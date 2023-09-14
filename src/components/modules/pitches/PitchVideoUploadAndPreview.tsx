import { gql, useMutation } from '@apollo/client'
import { Pitch, PitchVideo, PitchVideoCreateExtendedInput } from '@binding'
import {
  Box,
  Center,
  Flex,
  Button as ChakraButton,
  Spacer,
  Spinner,
  Link,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { EmptyStateText, Header, FileUpload } from '@components'
import React, { useRef, useState } from 'react'
import { FILE_TYPE_ACCEPT } from '@core/file-type'
import { useForm } from 'react-hook-form'
import { processFormData } from '@core/form'
import { handleApolloMutation } from '@core/request'
import ReactPlayer from 'react-player'
import { DeleteIcon } from '@chakra-ui/icons'
import { useAlert } from '@core/alert.provider'

interface PitchVideoUploadAndPreviewProps {
  pitch: Pitch
  extendedVideo?: boolean
  onUpload?: Function
  onDelete?: Function
  onNextClick?: Function
  nextLabel?: string
}

const CREATE_MUTATION = gql`
  mutation createPitchVideo($data: PitchVideoCreateExtendedInput!) {
    createPitchVideo(data: $data) {
      id
      video {
        file {
          url
        }
        wistiaId
      }
    }
  }
`

const DELETE_MUTATION = gql`
  mutation deletePitchVideo($where: PitchVideoWhereUniqueInput!) {
    deletePitchVideo(where: $where) {
      id
    }
  }
`

const UNPUBLISH_MUTATION = gql`
  mutation unpublishPitch($where: PitchWhereUniqueInput!) {
    unpublishPitch(where: $where) {
      id
    }
  }
`

export function PitchVideoUploadAndPreview({
  pitch,
  extendedVideo,
  onUpload,
  onDelete,
  onNextClick,
  nextLabel,
}: PitchVideoUploadAndPreviewProps) {
  const [mutateCreateVideo] = useMutation<{ createPitchVideo: PitchVideo }>(CREATE_MUTATION)
  const [mutateDeleteVideo] = useMutation<{ deletePitchVideo: PitchVideo }>(DELETE_MUTATION)
  const [mutateUnpublishPitch] = useMutation<{ unpublishPitch: Pitch }>(UNPUBLISH_MUTATION)
  const [isUploaded, setUploaded] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const {
    isOpen: isDeleteConfirmationOpen,
    onOpen: onDeleteConfirmationOpen,
    onClose: onDeleteConfirmationClose,
  } = useDisclosure()
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
    handleSubmit,
  } = useForm()
  const { setAlert } = useAlert()

  const pitchVideo = extendedVideo ? pitch.extendedPitchVideo : pitch.activePitchVideo

  const onFormSubmit = async (data: any) => {
    const processedData = processFormData<PitchVideoCreateExtendedInput & { videoAWSUrl: string }>(data)

    const result = await handleApolloMutation(
      mutateCreateVideo({
        variables: {
          data: {
            pitchId: pitch.id,
            video: {
              fileId: processedData.videoAWSUrl,
            },
            extendedVideo,
          },
        },
      }),
    )

    if (!result.error && onUpload) {
      onUpload()
    }
  }

  const onDeleteVideo = async () => {
    setAlert({ isHide: true })
    setDeleting(true)

    // If it's a 1-min video and pitch is published - we need to unpublish it first
    if (pitch?.status === 'PUBLISHED' && !extendedVideo) {
      const unpublishResult = await handleApolloMutation(
        mutateUnpublishPitch({
          variables: {
            where: {
              id: pitch.id,
            },
          },
        }),
      )

      if (unpublishResult.errors) {
        return
      }
    }

    const result = await handleApolloMutation(
      mutateDeleteVideo({
        variables: {
          where: {
            id: pitchVideo?.id,
          },
        },
      }),
    )

    setDeleting(false)

    if (!result.error) {
      setUploaded(false)
      setAlert({
        type: 'notification',
        message: 'File Successfully Deleted',
        status: 'success',
        timeout: 15000,
      })

      if (onDelete) {
        onDelete()
      }
    }
  }

  const formSumbitRef = useRef<HTMLInputElement>(null)
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  const videoTiming = extendedVideo ? 5 : 1
  const fileSizeLimit = extendedVideo ? 1048576000 : 524288000

  return (
    <>
      <Box bgColor="whiteAlpha.900" width="100%">
        <Box>
          <Header title={`Upload ${videoTiming} Minute Video`} />
        </Box>
        <Box className="px-4">
          {pitchVideo && <ReactPlayer width="100%" url={pitchVideo.video.file.url} controls />}
          {!pitchVideo && (
            <Center width="100%">
              {isUploaded ? (
                <Spinner size="xl" emptyColor="gray.200" color="orange.500" />
              ) : (
                <EmptyStateText>
                  You can upload your {videoTiming} minute video here when you're ready.
                  <br />
                  When filming, we recommend following the guidelines described in "Learn PIP / Film {videoTiming}{' '}
                  Minute Video".
                  <br />
                  <br />
                  Once you have crafted your pitch, you can publish it to the Scroobious Investor Portal.
                </EmptyStateText>
              )}
            </Center>
          )}
        </Box>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <input type="submit" ref={formSumbitRef} className="hidden" />
          <Flex px={4} pt={4}>
            <FileUpload
              accept={FILE_TYPE_ACCEPT.video}
              label="Pitch Video"
              colorScheme="green"
              hideLabel
              buttonLabel={`Upload ${videoTiming} Minute Video${extendedVideo ? ' (Optional)' : ''}`}
              errors={errors}
              register={register}
              setValue={setValue}
              clearErrors={clearErrors}
              onSuccess={() => {
                setUploaded(true)
                formSumbitRef.current?.click()
              }}
              fileSizeLimit={fileSizeLimit}
              fileSizeErrorMessage={
                <>
                  Oops... Looks like your {videoTiming} Minute Video is more than {fileSizeLimit / 1048576}Mb, please
                  use{' '}
                  <Link href="https://www.freeconvert.com/video-compressor" target="_blank" className="mx-1">
                    https://www.freeconvert.com/video-compressor
                  </Link>{' '}
                  or similar service to reduce the file size and upload the MP4 file here to try again.
                </>
              }
              required
              fieldId="videoAWSUrl"
              initialFileUrl=""
            />
            {pitchVideo && (
              <div className="space-y-4">
                <ChakraButton
                  p={4}
                  mt={2}
                  ml={5}
                  size="sm"
                  leftIcon={<DeleteIcon />}
                  colorScheme="gray"
                  onClick={onDeleteConfirmationOpen}
                  isLoading={isDeleting}
                  border="2px"
                  borderColor="gray.200"
                  fontWeight="normal"
                >
                  Delete Video
                </ChakraButton>
              </div>
            )}
            <Spacer />
            {pitchVideo && onNextClick && (
              <div className="space-y-4">
                <ChakraButton
                  p={4}
                  mt={2}
                  size="sm"
                  colorScheme="orange"
                  onClick={() => onNextClick()}
                  border="2px"
                  borderColor="orange.500"
                  fontWeight="normal"
                >
                  {nextLabel || 'Next'}
                </ChakraButton>
              </div>
            )}
          </Flex>
        </form>
      </Box>
      <AlertDialog
        isOpen={isDeleteConfirmationOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteConfirmationClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Video
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete video?
              {pitch?.status === 'PUBLISHED' && !extendedVideo && (
                <p className="my-5 font-semibold">
                  Please note, this action will unpublish your pitch from the Scroobious Investor Portal.
                </p>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <ChakraButton ref={cancelRef} onClick={onDeleteConfirmationClose} mx={2}>
                Cancel
              </ChakraButton>
              <ChakraButton
                colorScheme="orange"
                onClick={() => {
                  onDeleteConfirmationClose()
                  onDeleteVideo()
                }}
                mx={2}
              >
                Delete
              </ChakraButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
