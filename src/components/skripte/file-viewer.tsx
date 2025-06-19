'use client'

import {
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ScrollText,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Document, Page, pdfjs } from 'react-pdf'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'
// Add these if you need more features

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
  const [infiniteScroll, setInfiniteScroll] = useState<boolean>(true) // Default to infinite scroll
  const [pageInputValue, setPageInputValue] = useState<string>('')

  // Properly extract just the filename from the path
  const filename = path.split('/').pop() || ''
  const shareId = process.env.NEXT_PUBLIC_NEXTCLOUD_SHARE_ID

  // Fix the path cleaning to avoid filename duplication
  // Get the parent path without including the filename
  const parentPath = path.substring(0, path.lastIndexOf('/'))
  // Clean the parent path correctly
  const cleanPath = parentPath.replace(/^\//, '').replace(/^Mehatronika\//, '')

  // Construct full path properly
  const fullPath = `/${cleanPath}/${filename}`
  const fileUrl = `https://cloud.itzpere.com/s/${shareId}/download?path=${encodeURIComponent(fullPath)}`
  const mdUrl = `/api/markdown?path=${encodeURIComponent(cleanPath)}&filename=${encodeURIComponent(filename)}`

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
      <h3 className="font-medium mb-1">Greška pri učitavanju fajla</h3>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Pokušaj ponovo
      </Button>
      <Button variant="ghost" className="ml-2" asChild>
        <a href={fileUrl} download>
          <Download className="mr-2 h-4 w-4" />
          Preuzmi
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
    const pdfUrl = `/api/pdf?path=${encodeURIComponent(cleanPath)}&filename=${encodeURIComponent(filename)}`

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPageInputValue(e.target.value)
    }

    const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const newPage = parseInt(pageInputValue, 10)
        if (!isNaN(newPage) && newPage >= 1 && newPage <= numPages) {
          if (infiniteScroll) {
            // In infinite scroll mode, scroll to the page
            const pageElement = document.getElementById(`page-${newPage}`)
            if (pageElement) {
              pageElement.scrollIntoView({ behavior: 'smooth' })
            }
          } else {
            // In single page mode, just set the current page
            setCurrentPage(newPage)
          }
          setPageInputValue('')
        }
      }
    }

    return (
      <div className="container mx-auto p-4">
        <div className="sticky top-0 z-10 flex justify-between items-center p-2 mb-4 bg-background/80 backdrop-blur-sm rounded border">
          <div className="flex items-center gap-2">
            {!infiniteScroll && (
              <>
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
              </>
            )}

            {infiniteScroll && <span className="text-sm">{numPages} Strane</span>}

            {/* Add the input field for both modes */}
            <input
              type="text"
              placeholder={infiniteScroll ? 'Skoči na stranu' : 'Idi na stranu'}
              value={pageInputValue}
              onChange={handlePageInputChange}
              onKeyDown={handlePageInputKeyDown}
              className="w-24 h-8 px-2 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              title="Upiši broj strane i pritisni Enter"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInfiniteScroll(!infiniteScroll)}
              title={infiniteScroll ? 'Prikaži po jednu stranu' : 'Prikaži sve stranice'}
              className={infiniteScroll ? 'bg-muted' : ''}
            >
              <ScrollText className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale((s) => Math.min(2, s + 0.1))}
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setScale(1)} title="Reset zoom">
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
          {infiniteScroll ? (
            // Render all pages when in infinite scroll mode
            Array.from(new Array(numPages), (_, index) => (
              <div key={`page_${index + 1}`} id={`page-${index + 1}`} className="mb-8">
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  width={Math.min(window.innerWidth - 40, 800)}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={<div className="h-[800px] w-full animate-pulse bg-muted/50 rounded" />}
                  className="shadow-lg rounded-lg"
                />
              </div>
            ))
          ) : (
            // Render only the current page when in single page mode
            <Page
              pageNumber={currentPage}
              scale={scale}
              width={Math.min(window.innerWidth - 40, 800)}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={<div className="h-[800px] w-full animate-pulse bg-muted/50 rounded" />}
              className="shadow-lg rounded-lg"
            />
          )}
        </Document>
      </div>
    )
  }

  const renderMarkdownViewer = () => {
    if (error) return <ErrorUI message={error} />

    return (
      <div className="container mx-auto">
        <article className="prose prose-slate max-w-none p-8 prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:tracking-tight">
          <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
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
        className="inline-flex items-center gap-2 px-6 py-3 mt-12 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors shadow-sm"
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
