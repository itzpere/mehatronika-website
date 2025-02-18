import { FolderIcon, FileTextIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getFileIcon } from '@/components/skripte/file-icons'
import {
  getWebDAVClient,
  formatFileSize,
  isImage,
  getFileType,
  type FileStat,
} from '@/components/skripte/file-utils'
import { Header } from '@/components/skripte/header'
import { mdFileInfo } from '@/components/skripte/top-md-files'

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params
  const path = resolvedParams.slug.map((segment) => decodeURIComponent(segment)).join('/')

  const client = getWebDAVClient()

  // const files = (await client.getDirectoryContents(`/${path}`)) as FileStat[]
  const files = (await client.getDirectoryContents(`/${path}`, {
    details: true,
    data: `<?xml version="1.0" encoding="UTF-8"?>
      <d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
          <d:prop>
              <d:getlastmodified/>
              <d:getcontentlength/>
              <d:getcontenttype/>
              <d:resourcetype/>
              <d:getetag/>
              <oc:fileid />  
          </d:prop>
      </d:propfind>`,
  })) as unknown as FileStat[]

  const mdFiles = files
    .filter((file) => file.basename.endsWith('.md'))
    .sort((a, b) => a.basename.localeCompare(b.basename))

  const knownMdFiles = mdFiles
    .filter((file) => mdFileInfo.some((info) => info.filename === file.basename))
    .map((file) => {
      const info = mdFileInfo.find((md) => md.filename === file.basename)!
      return { ...file, title: info.title, description: info.description }
    })

  const unknownMdFiles = mdFiles.filter(
    (file) => !mdFileInfo.some((info) => info.filename === file.basename),
  )

  const otherFiles = files.filter((file) => !file.basename.endsWith('.md'))
  const directories = otherFiles
    .filter((file) => file.type === 'directory')
    .sort((a, b) => a.basename.localeCompare(b.basename))

  const regularFiles = otherFiles
    .filter((file) => file.type === 'file')
    .sort((a, b) => {
      const typeA = getFileType(a.basename)
      const typeB = getFileType(b.basename)
      return typeA === typeB ? a.basename.localeCompare(b.basename) : typeA - typeB
    })

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header path={path} />
      <div className="flex-1 overflow-y-auto ">
        {knownMdFiles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {knownMdFiles.map((file, index) => (
                <Link
                  key={index}
                  href={`/skripte/${path}/${encodeURIComponent(file.basename)}`}
                  className="group p-6 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FileTextIcon className="w-5 h-5 text-primary" />
                    <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                      {file.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {file.description}
                  </p>
                </Link>
              ))}
            </div>
            <div className="px-4 mb-4">
              <div className="h-px bg-border" />
            </div>
          </>
        )}

        <div className="flex flex-col gap-4 p-4 ">
          {directories.map((file, index) => (
            <Link
              key={index}
              href={`/skripte/${path}/${encodeURIComponent(file.basename)}`}
              className="h-12 rounded-lg bg-muted/50 flex items-center px-4 hover:bg-muted/70 transition-colors"
            >
              <FolderIcon className="w-5 h-5 mr-2 text-primary" />
              {file.basename}
            </Link>
          ))}

          {unknownMdFiles.map((file, index) => (
            <Link
              key={index}
              href={`/skripte/${path}/${encodeURIComponent(file.basename)}`}
              className="h-12 rounded-lg bg-muted/50 flex items-center px-4 hover:bg-muted/70 transition-colors"
            >
              <FileTextIcon className="w-5 h-5 mr-2 text-muted-foreground" />
              {file.basename.replace('.md', '')}
            </Link>
          ))}

          {regularFiles.map((file, index) => (
            <Link
              key={index}
              href={`/skripte/${path}/${encodeURIComponent(file.basename)}`}
              className="h-12 rounded-lg bg-muted/50 flex items-center px-4 hover:bg-muted/70 transition-colors group"
            >
              {isImage(file.basename) ? (
                <div className="relative w-8 h-8 mr-2 rounded overflow-hidden bg-muted">
                  <Image
                    src={`/api/thumbnail?path=${encodeURIComponent(`${path}/${file.basename}`)}`}
                    alt={file.basename}
                    fill
                    className="object-cover"
                    sizes="32px"
                    priority
                  />
                </div>
              ) : (
                getFileIcon(file.basename)
              )}
              <span className="flex-1">{file.basename}</span>
              <span className="text-sm text-muted-foreground">{formatFileSize(file.size)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
