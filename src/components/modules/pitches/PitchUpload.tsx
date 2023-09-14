import { FileUpload, FileUploadProps } from '@components'
import { FILE_TYPE_ACCEPT } from '@core/file-type'
import React from 'react'

interface PitchUploadProps extends FileUploadProps {}

export function PitchUpload({ fieldId, label, onSuccess, accept, buttonLabel, ...props }: PitchUploadProps) {
  return (
    <FileUpload
      accept={FILE_TYPE_ACCEPT.pdf}
      fieldId="PitchId"
      label="Upload Pitch"
      onSuccess={onSuccess}
      buttonLabel="Upload Pitch Deck"
      {...props}
    />
  )
}
