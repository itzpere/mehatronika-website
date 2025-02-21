'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import ReactMarkdown from 'react-markdown'
import { Document, Page, pdfjs } from 'react-pdf'
import remarkGfm from 'remark-gfm'

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
  const [markdown, setMarkdown] = useState('')

  const shareId = process.env.NEXT_PUBLIC_NEXTCLOUD_SHARE_ID
  // Remove Mehatronika prefix and filename from path
  const cleanPath = path
    .replace(/^\//, '')
    .replace(/^Mehatronika\//, '')
    .replace(new RegExp(`${filename}$`), '')

  const fileUrl = `https://cloud.itzpere.com/s/${shareId}/download?path=/${encodeURIComponent(cleanPath)}/${filename}`
  // TODO:testiraj jos malo da li url formating radi kako treba
  // TODO:dodaj jos file ektenzija

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })
  const mdUrl = `/api/markdown?path=${encodeURIComponent(cleanPath)}&filename=${filename}`

  useEffect(() => {
    if (extension === 'md') {
      fetch(mdUrl)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch markdown')
          return res.text()
        })
        .then(setMarkdown)
        .catch((err) => {
          console.error('Fetch error:', err)
        })
    }
  }, [extension, mdUrl])

  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return (
        <div className="flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src={fileUrl}
              alt={path}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      )
    // TODO: dodaj galery like image slide left right
    case 'mp4':
    case 'webm':
      return (
        <div className="flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full rounded-lg overflow-hidden shadow-lg bg-muted">
            <video
              src={fileUrl}
              controls
              controlsList="nodownload"
              className="w-full aspect-video"
              preload="metadata"
              poster={`/api/thumbnail?path=${encodeURIComponent(`${path}/${filename}`)}`}
            />
          </div>
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
      // case 'csv':
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
            loading={<div className="h-[1000px] w-[800px] animate-pulse bg-muted rounded" />}
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

    case 'md':
      return (
        <article
          className="prose prose-slate max-w-none dark:prose-invert p-8
        prose-headings:font-bold prose-headings:tracking-tight 
        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
        prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:p-0
        prose-code:text-primary prose-code:font-medium
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-bold
        prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1
        prose-img:rounded-lg prose-img:shadow-md
        prose-ul:list-disc prose-ol:list-decimal
        [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
        prose-table:border prose-table:border-border
        prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted/50
        prose-td:border prose-td:border-border prose-td:p-2
        [&_tr:nth-child(even)]:bg-muted/30"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      )

    default:
      return (
        <div className="h-full flex items-center justify-center">
          <a
            href={fileUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download {filename}
          </a>
        </div>
      )
  }
}
