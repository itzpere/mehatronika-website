import {
  FolderIcon,
  FileTextIcon,
  VideoIcon,
  // MoreVertical,
  // Download,
  // Share2,
  // Flag,
  // MessageCircle,
} from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { CommentsProvider } from '@/components/skripte/comments-sidebar'
import { getFileIcon } from '@/components/skripte/file-icons'
import {
  isImage,
  isVideo,
  isFile,
  processFiles,
  getContentsByPath,
} from '@/components/skripte/file-utils'
import { FileViewer } from '@/components/skripte/file-viewer'
import { LikeButton } from '@/components/skripte/like-button'
import { getLikeStatus } from '@/components/skripte/likes'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
import { auth } from '@/lib/auth/auth'
import type { File as PayloadFile } from '@/payload-types'
import Loading from './loading'

interface MdFileCardProps {
  file: PayloadFile & { title: string; description: string }
  path: string
}

const MdFileCard = ({ file, path }: MdFileCardProps) => {
  const excerpt =
    file.description?.length > 120
      ? file.description.substring(0, 120).trim() + '...'
      : file.description

  return (
    <Link
      href={`/skripte/${path}/${encodeURIComponent(file.name)}`}
      className="group flex flex-col h-full p-4 sm:p-5 rounded-xl bg-primary/5 border border-primary/10 
                transition-all hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10 
                hover:border-primary/20 active:scale-[0.98] touch-manipulation"
    >
      <div className="flex items-start gap-2 sm:gap-3 mb-2">
        <div className="mt-0 sm:mt-1 p-1.5 rounded-md bg-primary/10 text-primary">
          <FileTextIcon className="size-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-base sm:text-lg group-hover:text-primary transition-colors">
            {file.title}
          </h3>
        </div>
      </div>
      {excerpt && (
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{excerpt}</p>
      )}
      <div className="hidden sm:block mt-auto pt-3 text-xs text-primary/70 opacity-0 group-hover:opacity-100 transition-opacity">
        Klikni da otvoriš dokument →
      </div>
    </Link>
  )
}

const FileListItem = async ({ file, path }: { file: PayloadFile; path: string }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const likeStatus = await getLikeStatus(
    session?.user.id ?? '',
    (file.likes || []).map((like) => ({
      ...like,
      createdAt: like.createdAt || '',
      betterAuthUserId: like.likeBetterAuthUserId,
    })),
  )

  const fileName = file.name
  const fileUrl = `/skripte/${path}/${encodeURIComponent(fileName)}`
  const shareId = process.env.NEXT_PUBLIC_NEXTCLOUD_SHARE_ID
  const cleanPath = path
    .replace(/^\//, '')
    .replace(/^Mehatronika\//, '')
    .replace(new RegExp(`${fileName}$`), '')

  const downloadUrl = `https://cloud.itzpere.com/s/${shareId}/download?path=/${encodeURIComponent(cleanPath)}/${fileName}`
  // Format date with time
  const formattedDate = file.lastModified
    ? new Date(file.lastModified).toLocaleString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <div className="flex items-center gap-1 sm:gap-2 group w-full">
      {/* Make left side shrinkable with min-width */}
      <div className="h-14 rounded-lg bg-muted/50 flex-1 flex items-center px-2 sm:px-4 hover:bg-muted transition-all duration-200 min-w-0">
        <Link href={fileUrl} className="flex items-center w-full py-2 min-w-0">
          {/* Make icon fixed size */}
          <div className="flex-shrink-0 flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 mr-2 sm:mr-3">
            {isImage(fileName) ? (
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded overflow-hidden bg-muted">
                <Image
                  src={`/api/thumbnail?path=${encodeURIComponent(`${path}/${fileName}`)}`}
                  alt={fileName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 32px, 40px"
                  loading="lazy"
                  quality={60}
                />
              </div>
            ) : isVideo(fileName) ? (
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                <VideoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                {getFileIcon(fileName)}
              </div>
            )}
          </div>

          {/* Force this to shrink first */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="font-medium text-xs sm:text-sm truncate group-hover:text-primary transition-colors">
              {fileName}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
              <span className="hidden xs:inline">{formattedDate}</span>
              <span className="xs:hidden">{formattedDate.split(',')[0]}</span>
              {file.size && <span>{Math.round(file.size / 1024)} KB</span>}
            </div>
          </div>
        </Link>
      </div>

      {/* Add fixed width to prevent squeezing on small screens */}
      <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
        <LikeButton
          betterAuthUserID={session?.user?.id ?? ''}
          userUUID={file.uuid}
          likes={likeStatus.likes}
          isLiked={likeStatus.isLiked}
        />

        <a
          href={downloadUrl}
          download={fileName}
          className="p-2 rounded-full hover:bg-muted hover:scale-110 transition-all"
          title="Download"
          aria-label={`Download ${fileName}`}
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
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const path = '/' + params.slug.map(decodeURIComponent).join('/')
  try {
    if (isFile(path)) {
      const extension = path.split('.').pop()?.toLowerCase() || ''
      return (
        <div className="h-full overflow-y-auto">
          <FileViewer path={path} extension={extension} />
        </div>
      )
    }
    const content = await getContentsByPath(path)
    const { knownMdFiles, unknownMdFiles, regularFiles } = await processFiles(content.files)
    return (
      <div className="h-full overflow-y-auto w-auto">
        <CommentsProvider>
          <Suspense fallback={<Loading />}>
            <div className="flex-1">
              {knownMdFiles.length > 0 && (
                <>
                  <div className="px-3 sm:px-4 pt-3 sm:pt-4">
                    <h2 className="text-lg font-medium text-primary mb-2 sm:mb-3">
                      Istaknuti dokumenti
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {knownMdFiles.slice(0, 4).map((file, index) => (
                        <MdFileCard key={index} file={file} path={path} />
                      ))}
                    </div>
                  </div>
                  <div className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="h-px bg-border" />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4">
                {/* Directories */}
                <Suspense>
                  {content.folders.map((file, index) => (
                    <Link
                      key={index}
                      href={`/skripte/${path}/${encodeURIComponent(file.name)}`}
                      className="h-11 sm:h-12 rounded-lg bg-muted/50 flex items-center px-3 sm:px-4 hover:bg-muted/70 transition-colors touch-manipulation"
                    >
                      <FolderIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                      <span className="truncate text-sm sm:text-base">{file.name}</span>
                    </Link>
                  ))}
                </Suspense>

                {/* Unknown MD files */}
                <Suspense>
                  {unknownMdFiles.map((file, index) => (
                    <Link
                      key={index}
                      href={`/skripte/${path}/${encodeURIComponent(file.name)}`}
                      className="h-11 sm:h-12 rounded-lg bg-muted/50 flex items-center px-3 sm:px-4 hover:bg-muted/70 transition-colors"
                    >
                      <FileTextIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-muted-foreground" />
                      <span className="truncate text-sm sm:text-base">
                        {file.name.replace('.md', '')}
                      </span>
                    </Link>
                  ))}
                </Suspense>

                {/* Regular files */}
                <Suspense>
                  {regularFiles.map((file, index) => (
                    <FileListItem key={index} file={file} path={path} />
                  ))}
                </Suspense>
              </div>
            </div>
          </Suspense>
        </CommentsProvider>
      </div>
    )
  } catch (error) {
    console.error('Error processing files:', error)
    throw error
  }
}
