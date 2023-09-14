import { FileCreateSignedURLInput } from '@binding'
import { callAPI } from '@core/request'

export async function getUploadSignedUrl(data: FileCreateSignedURLInput) {
  return callAPI<any>({
    variables: { data },
    query: `
      mutation ($data: FileCreateSignedURLInput!) {
        createUploadSignedUrl(data: $data) {
         signedUrl
        }
      }
    `,
    operationName: 'createUploadSignedUrl',
  })
}

// const mbToBytes = (mb: number) => mb * 1024 * 1024

export async function uploadToS3({ file, data }: any) {
  // const maxPDFFileSize = Number(process.env.MAX_PDF_FILE_SIZE) || 0
  // const maxVideoFileSize = Number(process.env.MAX_VIDEO_FILE_SIZE) || 0
  // if (file.type === 'application/pdf' && file.size > mbToBytes(maxPDFFileSize)) {
  //   throw new Error(`Max PDF file upload size is ${maxPDFFileSize} MB`)
  // }
  // if (file.type !== 'application/pdf' && file.size > mbToBytes(maxVideoFileSize)) {
  //   throw new Error(`Max Video file upload size is ${maxVideoFileSize} MB`)
  // }

  return await getUploadSignedUrl(data)
    .then((results) => {
      // console.log('getUploadSignedUrl results :>> ', results)
      if (results.error) {
        throw results.error
      }
      // console.log('results.signedUrl :>> ', results.signedUrl)
      return results.signedUrl
    })
    .then((signedUrl) =>
      fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Content-Length': file.size,
        },
        body: file,
      }),
    )
    // .then((result) => {
    //   // console.log('POST RESULT', result)
    //   return result
    // })
    .then(({ url }) => url.split('?')[0])
}
