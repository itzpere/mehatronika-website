'use client'

import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Document, Page, pdfjs } from 'react-pdf'

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface FileViewerProps {
  path: string
  filename: string
  extension: string
}

export function FileViewer({ path, filename, extension }: FileViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const shareId = process.env.NEXT_PUBLIC_NEXTCLOUD_SHARE_ID
  // Remove Mehatronika prefix and filename from path
  const cleanPath = path
    .replace(/^\//, '')
    .replace(/^Mehatronika\//, '')
    .replace(new RegExp(`${filename}$`), '')

  const fileUrl = `https://cloud.itzpere.com/s/${shareId}/download?path=/${encodeURIComponent(cleanPath)}/${filename}`
  // TODO:testiraj jos malo da li url formating radi kako treba
  // TODO:dodaj jos file ektenzija
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return (
        <div className="container mx-auto p-4">
          <img src={fileUrl} alt={path} className="max-w-full" />
        </div>
      )

    case 'mp4':
    case 'webm':
      return (
        <div className="container mx-auto p-4">
          <video src={fileUrl} controls className="w-full" />
        </div>
      )

    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'pptx':
    case 'odt':
    case 'ods':
      const msViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${fileUrl}`
      console.log(`msViewerUrl: ${msViewerUrl}`)
      return (
        <div className="container mx-auto p-4">
          <iframe src={msViewerUrl} width="100%" height="800" className="border-0" />
        </div>
      )

    case 'pdf':
      const pdfUrl = `/api/pdf?path=${encodeURIComponent(cleanPath)}&filename=${filename}`
      return (
        <div className="container mx-auto p-4">
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            }
            error={
              <div className="text-red-500 text-center p-4">
                Error loading PDF. Please try downloading instead.
              </div>
            }
            className="flex flex-col items-center gap-4"
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div key={index} ref={index === numPages - 1 ? ref : undefined}>
                <Page
                  pageNumber={index + 1}
                  width={800}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={<div className="h-[1000px] w-[800px] animate-pulse bg-muted rounded" />}
                  className="shadow-lg rounded-lg"
                />
              </div>
            ))}
          </Document>
        </div>
      )

    default:
      return (
        <div className="container mx-auto p-4">
          <a href={fileUrl} download className="text-primary hover:underline">
            Download File
          </a>
        </div>
      )
  }
}
