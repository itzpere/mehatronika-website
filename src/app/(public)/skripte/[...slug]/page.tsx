import { FolderIcon, FileTextIcon, VideoIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import {
  CommentButton,
  CommentsProvider,
  CommentSidebar,
} from '@/components/skripte/comments-sidebar'
import { getFileIcon } from '@/components/skripte/file-icons'
import {
  getWebDAVClient,
  isImage,
  isVideo,
  getFileType,
  type FileStat,
} from '@/components/skripte/file-utils'
import { FileViewer } from '@/components/skripte/file-viewer'
import { LikeButton } from '@/components/skripte/like-button'
import { ReportDialog } from '@/components/skripte/report-dialog'
import { mdFileInfo } from '@/components/skripte/top-md-files'
import configPromise from '@payload-config'

// FIXME: videos not being displayed

const payload = await getPayload({
  config: configPromise,
})

async function getLikes(fileId: number) {
  const file = await payload.find({
    collection: 'files',
    where: {
      fileId: {
        equals: fileId,
      },
    },
  })
  return file.docs[0]?.likes || 0
}

async function likeFile(fileId: number) {
  'use server'

  const cookieStore = await cookies()
  const likedFiles = JSON.parse(cookieStore.get('likedFiles')?.value || '[]')
  const isLiked = likedFiles.includes(fileId)

  const existingFile = await payload.find({
    collection: 'files',
    where: {
      fileId: { equals: fileId },
    },
  })

  const currentLikes = existingFile.docs[0]?.likes || 0

  if (isLiked) {
    // Unlike: Remove from liked files and decrease count
    const newLikedFiles = likedFiles.filter((id: number) => id !== fileId)
    cookieStore.set('likedFiles', JSON.stringify(newLikedFiles))

    await payload.update({
      collection: 'files',
      where: { fileId: { equals: fileId } },
      data: { likes: Math.max(currentLikes - 1, 0) },
    })
  } else {
    // Like: Add to liked files and increase count
    likedFiles.push(fileId)
    cookieStore.set('likedFiles', JSON.stringify(likedFiles))

    await payload.update({
      collection: 'files',
      where: { fileId: { equals: fileId } },
      data: { likes: currentLikes + 1 },
    })
  }
}

function isFile(path: string) {
  return path.split('/').pop()?.includes('.') || false
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const path = params.slug.map((segment) => decodeURIComponent(segment)).join('/')

  const client = getWebDAVClient()

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

  // Check and add files to database
  for (const file of files) {
    const fileId = file.props?.fileid

    if (fileId) {
      const existingFile = await payload.find({
        collection: 'files',
        where: {
          fileId: {
            equals: fileId,
          },
        },
      })

      if (existingFile.totalDocs === 0) {
        await payload.create({
          collection: 'files',
          data: {
            fileId: fileId,
            fileName: file.basename,
            modified: file.lastmod,
            size: file.size,
            location: file.filename,
          },
        })
      } else {
      }
    }
  }

  // Check if path is a file
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

  const cookieStore = await cookies()
  const likedFiles = JSON.parse(cookieStore.get('likedFiles')?.value || '[]')

  return (
    <div className="h-full overflow-y-auto">
      <CommentsProvider>
        <div className="flex-1">
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

            {await Promise.all(
              regularFiles.map(async (file, index) => {
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
                            priority
                          />
                        </div>
                      ) : isVideo(file.basename) ? (
                        <VideoIcon className="w-5 h-5 mr-2 text-blue-500" />
                      ) : (
                        getFileIcon(file.basename)
                      )}
                      <span className="flex-1">{file.basename}</span>
                    </Link>

                    <div className="flex items-center gap-2">
                      <LikeButton
                        file={file}
                        likes={likes}
                        isLiked={likedFiles.includes(file.props.fileid)}
                        onLike={likeFile}
                      />
                      <CommentButton />
                      <ReportDialog />
                    </div>
                  </div>
                )
              }),
            )}
          </div>
        </div>
        <CommentSidebar />
      </CommentsProvider>
    </div>
  )
}
