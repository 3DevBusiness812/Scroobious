export const FILE_TYPE_ACCEPT = {
  // Don't allow svg because S3 doesn't play well with svgs
  // See https://stackoverflow.com/questions/57961780/jepg-multipart-form-data-in-s3-is-always-corrupt
  image: '.jpg,.jpeg,.png',
  video: 'video/mp4,video/x-m4v,video',
  pdf: '.pdf,application/pdf',
}
