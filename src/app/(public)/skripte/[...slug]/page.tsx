import { FolderIcon, FileTextIcon, VideoIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { CommentsProvider, CommentSidebar } from '@/components/skripte/comments-sidebar'
import { getFileIcon } from '@/components/skripte/file-icons'
// import { getLikes, likeFile, getLikedFiles } from '@/components/skripte/file-likes'
import {
  isImage,
  isVideo,
  isFile,
  processFiles,
  getContentsByPath,
} from '@/components/skripte/file-utils'
import { FileViewer } from '@/components/skripte/file-viewer'
// import { LikeButton } from '@/components/skripte/like-button'
import type { File as PayloadFile } from '@/payload-types'
import Loading from './loading'

interface MdFileCardProps {
  file: PayloadFile & { title: string; description: string }
  path: string
}

const MdFileCard = ({ file, path }: MdFileCardProps) => (
  <Link
    href={`/skripte/${path}/${encodeURIComponent(file.name)}`}
    className="group p-6 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-all hover:shadow-md"
  >
    <div className="flex items-center gap-3 mb-3">
      <FileTextIcon className="w-5 h-5 text-primary" />
      <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
        {file.title}
      </h3>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed">{file.description}</p>
  </Link>
)

const FileListItem = async ({ file, path }: { file: PayloadFile; path: string }) => {
  return (
    <div className="h-12 rounded-lg bg-muted/50 flex items-center px-4 hover:bg-muted/70 transition-colors group">
      <Link
        href={`/skripte/${path}/${encodeURIComponent(file.name)}`}
        className="flex items-center flex-1"
      >
        {isImage(file.name) ? (
          <div className="relative w-8 h-8 mr-2 rounded overflow-hidden bg-muted">
            <Image
              src={`/api/thumbnail?path=${encodeURIComponent(`${path}/${file.name}`)}`}
              alt={file.name}
              fill
              className="object-cover"
              sizes="32px"
              loading="lazy"
              quality={60}
            />
          </div>
        ) : isVideo(file.name) ? (
          <VideoIcon className="w-5 h-5 mr-2 text-blue-500" />
        ) : (
          getFileIcon(file.name)
        )}
        <span className="flex-1 line-clamp-2">{file.name}</span>
      </Link>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {knownMdFiles.map((file, index) => (
                      <MdFileCard key={index} file={file} path={path} />
                    ))}
                  </div>
                  <div className="px-4 mb-4">
                    <div className="h-px bg-border" />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-4 p-4">
                {/* Directories */}
                <Suspense>
                  {content.folders.map((file, index) => (
                    <Link
                      key={index}
                      href={`/skripte/${path}/${encodeURIComponent(file.name)}`}
                      className="h-12 rounded-lg bg-muted/50 flex items-center px-4 hover:bg-muted/70 transition-colors"
                    >
                      <FolderIcon className="w-5 h-5 mr-2 text-primary" />
                      {file.name}
                    </Link>
                  ))}
                </Suspense>

                {/* Unknown MD files */}
                <Suspense>
                  {unknownMdFiles.map((file, index) => (
                    <Link
                      key={index}
                      href={`/skripte/${path}/${encodeURIComponent(file.name)}`}
                      className="h-12 rounded-lg bg-muted/50 flex items-center px-4 hover:bg-muted/70 transition-colors"
                    >
                      <FileTextIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                      {file.name.replace('.md', '')}
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
            <CommentSidebar />
          </Suspense>
        </CommentsProvider>
      </div>
    )
  } catch (error) {
    console.error('Error processing files:', error)
    throw error
  }
}
