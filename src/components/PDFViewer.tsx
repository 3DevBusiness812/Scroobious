import { Button, Center } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
interface PDFViewerProps {
  url: string
  width?: number
  height?: number
  controls?: boolean
  download?: boolean
}
export function PDFViewer({ url, width, height, controls, download }: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)

  return (
    // overflow-hidden fixes bugs where the PDF extends vertically below and blocks elements beneath the PDF
    <div className="flex flex-col overflow-hidden">
      <Center>
        <Document
          file={url}
          onLoadError={console.error}
          onLoadSuccess={({ numPages }: any) => setNumPages(numPages)}
          renderMode="svg"
          loading={<div className="w-64 text-center">Loading PDF</div>}
        >
          <Page pageNumber={pageNumber} width={width} height={height} renderAnnotationLayer={false} />
        </Document>
      </Center>
      {controls && numPages > 0 && (
        <div className="flex flex-row py-2 justify-between justify-items-center">
          {numPages > 1 && (
            <Button size="sm" onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1}>
              PREV
            </Button>
          )}
          <div className="flex-1 text-center">
            <p className="text-sm inline-block mx-auto">
              Page {pageNumber} of {numPages}
            </p>
          </div>
          {numPages > 1 && (
            <Button
              size="sm"
              onClick={() => setPageNumber(pageNumber + 1)}
              disabled={numPages === pageNumber || numPages < 2}
            >
              NEXT
            </Button>
          )}
        </div>
      )}
      {download && (
        <div className="w-full">
          <a className="underline float-right" href={url} download>
            Download PDF
          </a>
        </div>
      )}
    </div>
  )
}
