import { FileCreateSignedURLInput } from '@binding'
import { Button, FormLabel, HStack, Image, Input, InputProps, Link } from '@chakra-ui/react'
import { useAlert } from '@core/alert.provider'
import { uploadToS3 } from '@core/upload-to-s3'
import React, {ReactElement, useRef, useState} from 'react'
import { FieldErrors, RegisterOptions } from 'react-hook-form'
import { BsUpload } from 'react-icons/bs'
import { FormError } from './FormError'

interface FileUploadHookFormProps {
  register: any
  errors: FieldErrors
  setValue?: Function
  clearErrors?: Function
  registerOptions?: RegisterOptions
}

export interface FileUploadProps extends InputProps, FileUploadHookFormProps {
  readonly?: boolean
  fieldId: string
  label: string
  accept: string
  hideLabel?: boolean
  buttonLabel?: string
  onSuccess?: (data: any) => any
  fileSizeLimit?: number
  fileSizeErrorMessage?: string | ReactElement
  colorScheme?: any // TBD: Find colorScheme type from chakra-ui
  required?: boolean
  initialFileUrl?: string // What should we display on load?
  displayImage?: boolean
}
export const FileUpload = ({
  fieldId,
  label,
  buttonLabel = 'Upload',
  colorScheme = 'gray',
  onSuccess,
  fileSizeLimit,
  fileSizeErrorMessage,
  readonly,
  hideLabel,
  required,
  setValue,
  register,
  errors: reactHookFormErrors,
  clearErrors,
  registerOptions,
  accept,
  initialFileUrl = '',
  displayImage,
  ...props
}: FileUploadProps) => {
  const [url, setUrl] = useState(initialFileUrl)

  const [loading, setLoading] = useState(false)
  const [componentCustomError, setComponentCustomError] = useState<Error | null>(null)
  const hiddenFileInput = useRef<any>(null)
  // We need to do some special handling for the required prop to have react-hook-form validate it properly
  const [regOptions] = useState({ ...registerOptions, required: required && `You must specify ${label} ` })

  const { setAlert } = useAlert()

  const handleClick = () => {
    hiddenFileInput.current.click()
  }
  const handleFileSelection = async (event: any) => {
    // TBD: Currently uploading single file.
    const file = event.target.files[0]
    if (file) {
      if (fileSizeLimit && file.size > fileSizeLimit) {
        setAlert({
          type: 'notification',
          message: fileSizeErrorMessage || `File Size Limit of ${fileSizeLimit / 1048576}Mb Exceeded`,
          status: 'error',
          timeout: 30000,
        })
        return
      }

      setAlert({ isHide: true })
      setLoading(true)
      setComponentCustomError(null)
      const data: FileCreateSignedURLInput = {
        fileName: file.name,
      }
      await uploadToS3({ file, data })
        .then((s3Url: string) => {
          // console.log('s3Url :>> ', s3Url);
          setUrl(s3Url)
          // console.log('setValue :>> ', setValue)
          if (setValue) {
            setValue(fieldId, s3Url, { shouldDirty: true })
          }
          if (clearErrors) {
            clearErrors(fieldId)
          }
          return s3Url
        })
        .then(onSuccess)
        .catch(setComponentCustomError)
        .finally(() => setLoading(false))
      setAlert({
        type: 'notification',
        message: 'File Successfully Uploaded',
        status: 'success',
        timeout: 15000,
      })
    } else {
      // User has cancelled file selection.
      // No error needs to be shown.
    }
  }

  if (readonly) {
    return <div />
  }

  return (
    <div className="space-y-4">
      {/* The label itself is the only visible element on the page */}
      <HStack alignItems="flex-start">
        <div>
          {!hideLabel && <FormLabel htmlFor={fieldId}>{label}</FormLabel>}

          <Button
            p={4}
            mt={2}
            size="sm"
            colorScheme={colorScheme}
            isLoading={loading}
            loadingText="Uploading"
            onClick={handleClick}
            border="2px"
            borderColor="gray.200"
            fontWeight="normal"
          >
            <BsUpload className="mr-2" color="green" size={20} />
            {buttonLabel}
          </Button>
        </div>

        {url && displayImage && (
          <div className="pl-10 py-4 pr-6">
            <Image maxH={200} src={url} />
          </div>
        )}
      </HStack>

      {/* This is the hidden input that is tied to react-hook-form */}
      <Input {...register(fieldId, regOptions)} id={fieldId} defaultValue={url} name={fieldId} type="hidden" />

      {/* This is the actual file input that is not displayed */}
      <Input
        className="m-0"
        id={`file-${fieldId}`}
        name={`file-${fieldId}`}
        accept={accept}
        type="file"
        ref={hiddenFileInput}
        style={{ display: 'none' }}
        onChange={handleFileSelection}
        {...props}
      />

      {/* Show either the validation triggered by react-hook-form or this component  */}
      <FormError fieldId={fieldId} errors={{ [fieldId]: componentCustomError || reactHookFormErrors[fieldId] }} />
    </div>
  )
}
