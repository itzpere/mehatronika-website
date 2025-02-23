import { FolderIcon, FileTextIcon, VideoIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { Suspense } from 'react'
import {
  // CommentButton,
  CommentsProvider,
  CommentSidebar,
} from '@/components/skripte/comments-sidebar'
import { getFileIcon } from '@/components/skripte/file-icons'
import { getLikes, likeFile, getLikedFiles } from '@/components/skripte/file-likes'
import {
  getWebDAVClient,
  isImage,
  isVideo,
  getFileType,
  type FileStat,
} from '@/components/skripte/file-utils'
import { FileViewer } from '@/components/skripte/file-viewer'
import { LikeButton } from '@/components/skripte/like-button'
// import { ReportDialog } from '@/components/skripte/report-dialog'
import { mdFileInfo } from '@/components/skripte/top-md-files'
import configPromise from '@payload-config'
import Loading from './loading'

export const revalidate = 3600 // Revalidate every hour

const payload = await getPayload({
  config: configPromise,
})

function isFile(path: string) {
  return path.split('/').pop()?.includes('.') || false
}

const client = getWebDAVClient()

// Helper functions for database operations
async function createFileInDB(file: FileStat) {
  const fileId = file.props?.fileid
  if (!fileId) return null

  return payload.create({
    collection: 'files',
    data: {
      fileId,
      fileName: file.basename,
      modified: file.lastmod,
      size: file.size,
      location: file.filename,
    },
  })
}

async function checkAndCreateFiles(files: FileStat[]) {
  const fileOps = files.map(async (file) => {
    const fileId = file.props?.fileid
    if (!fileId) return

    const existingFile = await payload.find({
      collection: 'files',
      where: { fileId: { equals: fileId } },
    })

    if (existingFile.totalDocs === 0) {
      return createFileInDB(file)
    }
  })

  return Promise.all(fileOps)
}

async function processFiles(files: FileStat[]) {
  // Parallel processing of different file types
  const [mdFiles, otherFiles] = await Promise.all([
    files.filter((file) => file.basename.endsWith('.md')),
    files.filter((file) => !file.basename.endsWith('.md')),
  ])

  // Process MD files
  const knownMdFiles = mdFiles
    .filter((file) => mdFileInfo.some((info) => info.filename === file.basename))
    .map((file) => ({
      ...file,
      title: mdFileInfo.find((md) => md.filename === file.basename)!.title,
      description: mdFileInfo.find((md) => md.filename === file.basename)!.description,
    }))

  const unknownMdFiles = mdFiles.filter(
    (file) => !mdFileInfo.some((info) => info.filename === file.basename),
  )

  // Process other files in parallel
  const [directories, regularFiles] = await Promise.all([
    otherFiles
      .filter((file) => file.type === 'directory')
      .sort((a, b) => a.basename.localeCompare(b.basename)),
    otherFiles
      .filter((file) => file.type === 'file')
      .sort((a, b) => {
        const typeA = getFileType(a.basename)
        const typeB = getFileType(b.basename)
        return typeA === typeB ? a.basename.localeCompare(b.basename) : typeA - typeB
      }),
  ])

  return {
    knownMdFiles,
    unknownMdFiles,
    directories,
    regularFiles,
  }
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const path = params.slug.map((segment) => decodeURIComponent(segment)).join('/')

  try {
    const files = (await client.getDirectoryContents(
      `${process.env.WEBDAV_DEFAULT_FOLDER || '/'}${path}`,
      {
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
      },
    )) as unknown as FileStat[]

    // Parallel operations
    const [processedFiles, _] = await Promise.all([processFiles(files), checkAndCreateFiles(files)])

    if (isFile(path)) {
      const extension = files[0].basename.split('.').pop()?.toLowerCase()
      return (
        <div className="h-full overflow-y-auto">
          <FileViewer
            path={files[0].filename}
            filename={files[0].basename}
            extension={extension || ''}
          />
        </div>
      )
    }

    const likedFiles = await getLikedFiles()

    // Rest of the component rendering...
    return (
      <div className="h-full overflow-y-auto w-auto">
        <CommentsProvider>
          <Suspense fallback={<Loading />}>
            <div className="flex-1">
              {/* grid for top text files */}
              {processedFiles.knownMdFiles.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {processedFiles.knownMdFiles.map((file, index) => (
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
              {/* directory mapping at top */}
              <div className="flex flex-col gap-4 p-4 ">
                {processedFiles.directories.map((file, index) => (
                  <Link
                    key={index}
                    href={`/skripte/${path}/${encodeURIComponent(file.basename)}`}
                    className="h-12 rounded-lg bg-muted/50 flex items-center px-4 hover:bg-muted/70 transition-colors"
                  >
                    <FolderIcon className="w-5 h-5 mr-2 text-primary" />
                    {file.basename}
                  </Link>
                ))}
                {/* other files */}
                {processedFiles.unknownMdFiles.map((file, index) => (
                  <Link
                    key={index}
                    href={`/skripte/${path}/${encodeURIComponent(file.basename)}`}
                    className="h-12 rounded-lg bg-muted/50 flex items-center px-4 hover:bg-muted/70 transition-colors"
                  >
                    <FileTextIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                    {file.basename.replace('.md', '')}
                  </Link>
                ))}

                {await Promise.all(
                  processedFiles.regularFiles.map(async (file, index) => {
                    const likes = await getLikes(file.props.fileid)
                    return (
                      <div
                        key={index}
                        className="h-12 rounded-lg bg-muted/50 flex items-center px-4 hover:bg-muted/70 transition-colors group"
                      >
                        <Link
                          href={`/skripte/${path}/${encodeURIComponent(file.basename)}`}
                          className="flex items-center flex-1"
                        >
                          {isImage(file.basename) ? (
                            <div className="relative w-8 h-8 mr-2 rounded overflow-hidden bg-muted">
                              <Image
                                src={`/api/thumbnail?path=${encodeURIComponent(`${path}/${file.basename}`)}`}
                                alt={file.basename}
                                fill
                                className="object-cover"
                                sizes="32px"
                                loading="lazy"
                                quality={60}
                              />
                            </div>
                          ) : isVideo(file.basename) ? (
                            <VideoIcon className="w-5 h-5 mr-2 text-blue-500" />
                          ) : (
                            getFileIcon(file.basename)
                          )}
                          <span className="flex-1 line-clamp-2">{file.basename}</span>
                        </Link>

                        <div className="flex items-center gap-2">
                          <LikeButton
                            file={file}
                            likes={likes}
                            isLiked={likedFiles.includes(file.props.fileid)}
                            onLike={likeFile}
                          />
                          {/* <CommentButton /> */}
                          {/* <ReportDialog /> */}
                          {/* TODO: add in V2 */}
                        </div>
                      </div>
                    )
                  }),
                )}
              </div>
            </div>
            <CommentSidebar />
          </Suspense>
        </CommentsProvider>
      </div>
    )
  } catch (error) {
    console.error('Error processing files:', error)
    throw error // Let Next.js error boundary handle it
  }
}
