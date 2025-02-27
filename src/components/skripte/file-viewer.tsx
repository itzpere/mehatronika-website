'use client'

import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import ReactMarkdown from 'react-markdown'
import { Document, Page, pdfjs } from 'react-pdf'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface FileViewerProps {
  path: string
  extension: string
}

export function FileViewer({ path, extension }: FileViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  const [markdown, setMarkdown] = useState('')

  const filename = path.split('/').pop() || ''
  const shareId = process.env.NEXT_PUBLIC_NEXTCLOUD_SHARE_ID
  const cleanPath = path
    .replace(/^\//, '')
    .replace(/^Mehatronika\//, '')
    .replace(new RegExp(`${filename}$`), '')

  const fileUrl = `https://cloud.itzpere.com/s/${shareId}/download?path=/${encodeURIComponent(cleanPath)}/${filename}`
  const mdUrl = `/api/markdown?path=${encodeURIComponent(cleanPath)}&filename=${filename}`

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    if (extension === 'md') {
      fetch(mdUrl)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch markdown')
          return res.text()
        })
        .then((content) => {
          setMarkdown(content)
        })
        .catch((err) => {
          console.error('Fetch error:', err)
          setError('Failed to load markdown content')
        })
    }
  }, [extension, mdUrl])

  // Helper function for error UI
  const ErrorUI = ({ message }: { message: string }) => (
    <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-8 text-center">
      <div className="text-destructive mb-2 text-2xl">⚠️</div>
      <h3 className="font-medium mb-1">Error Loading File</h3>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Try Again
      </Button>
      <Button variant="ghost" className="ml-2" asChild>
        <a href={fileUrl} download>
          <Download className="mr-2 h-4 w-4" />
          Download Instead
        </a>
      </Button>
    </div>
  )

  const renderImageViewer = () => (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative max-w-4xl w-full rounded-lg overflow-hidden shadow-lg">
        <Image
          src={fileUrl}
          alt={path}
          width={1200}
          height={800}
          className="w-full h-auto object-contain"
          priority
          onError={() => {
            setError('Failed to load image')
          }}
        />
      </div>
    </div>
  )

  const renderVideoViewer = () => (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative max-w-4xl w-full rounded-lg overflow-hidden bg-gray-50">
        <video
          src={fileUrl}
          controls
          className="w-full aspect-video"
          preload="metadata"
          poster={`/api/thumbnail?path=${encodeURIComponent(path)}`}
          onError={() => {
            setError('Failed to load video')
          }}
        />
      </div>
    </div>
  )

  const renderPdfViewer = () => {
    const pdfUrl = `/api/pdf?path=${encodeURIComponent(cleanPath)}&filename=${filename}`

    return (
      <div className="container mx-auto p-4">
        <div className="sticky top-0 z-10 flex justify-between items-center p-2 mb-4 bg-background/80 backdrop-blur-sm rounded border">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {currentPage} / {numPages || '?'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              disabled={currentPage >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale((s) => Math.min(2, s + 0.1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setScale(1)}>
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages)
          }}
          onLoadError={(error) => {
            console.error('PDF load error:', error)
            setError('Failed to load PDF document')
          }}
          loading={<div className="h-[800px] w-full animate-pulse bg-muted/50 rounded" />}
          error={<ErrorUI message="Error loading PDF. Please try downloading instead." />}
          className="flex flex-col items-center"
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            width={Math.min(window.innerWidth - 40, 800)}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={<div className="h-[800px] w-full animate-pulse bg-muted/50 rounded" />}
            className="shadow-lg rounded-lg"
          />
        </Document>
      </div>
    )
  }

  const renderMarkdownViewer = () => {
    if (error) return <ErrorUI message={error} />

    return (
      <div className="container mx-auto">
        <article
          className="prose prose-slate max-w-none p-8
          prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:tracking-tight 
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
          prose-strong:text-foreground prose-strong:font-bold
          prose-ul:list-disc prose-ol:list-decimal
          [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Improved code block rendering with syntax highlighting
              code({
                _node,
                inline,
                className,
                children,
                ...props
              }: {
                _node?: any
                inline?: boolean
                className?: string
                children?: React.ReactNode
                [key: string]: any
              }) {
                const match = /language-(\w+)/.exec(className || '')
                const language = match ? match[1] : ''

                return !inline ? (
                  <div className="relative group">
                    {language && (
                      <div className="absolute right-2 top-2 text-xs px-2 py-1 rounded bg-muted/70 text-muted-foreground">
                        {language}
                      </div>
                    )}
                    <pre
                      className={`${className} rounded-lg p-4 overflow-x-auto bg-muted/50 border border-border`}
                    >
                      <code {...props}>{children}</code>
                    </pre>
                    <button
                      onClick={() => navigator.clipboard.writeText(String(children))}
                      className="absolute opacity-0 group-hover:opacity-100 right-2 bottom-2 text-xs 
                                px-2 py-1 rounded bg-primary/10 text-primary transition-opacity"
                      aria-label="Copy code"
                    >
                      Copy
                    </button>
                  </div>
                ) : (
                  <code className="bg-muted/30 text-primary px-1 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                )
              },
              // Interactive checkboxes
              li({
                _node,
                _className,
                checked,
                children,
                ...props
              }: {
                _node?: any
                _className?: string
                checked?: boolean
                children?: React.ReactNode
                [key: string]: any
              }) {
                if (checked !== null && checked !== undefined) {
                  return (
                    <li {...props} className="flex items-center gap-2">
                      <input type="checkbox" checked={checked} readOnly className="mt-0" />
                      <span>{children}</span>
                    </li>
                  )
                }
                return <li {...props}>{children}</li>
              },
              // Better blockquotes
              blockquote({ children, ...props }) {
                return (
                  <blockquote
                    className="border-l-4 border-l-primary bg-muted/30 pl-4 py-1 italic text-muted-foreground"
                    {...props}
                  >
                    {children}
                  </blockquote>
                )
              },
              // Better table rendering
              table({ children }) {
                return (
                  <div className="overflow-x-auto">
                    <table className="border-collapse border border-border w-full">
                      {children}
                    </table>
                  </div>
                )
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    )
  }

  const renderOfficeViewer = () => {
    const msViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`

    return (
      <div className="container mx-auto p-4">
        <iframe
          src={msViewerUrl}
          width="100%"
          height="800"
          className="border-0 rounded-lg shadow-md"
          onError={() => {
            setError('Failed to load document preview')
          }}
        />
      </div>
    )
  }

  const renderDownloadButton = () => (
    <div className="h-full flex items-center justify-center">
      <a
        href={fileUrl}
        download
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors shadow-sm"
      >
        <Download className="h-5 w-5" />
        Download {filename}
      </a>
    </div>
  )

  // Handle file type rendering
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return renderImageViewer()

    case 'mp4':
    case 'webm':
    case 'mov':
      return renderVideoViewer()

    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'pptx':
    case 'odt':
    case 'ods':
      return renderOfficeViewer()

    case 'pdf':
      return renderPdfViewer()

    case 'md':
      return renderMarkdownViewer()

    default:
      return renderDownloadButton()
  }
}
