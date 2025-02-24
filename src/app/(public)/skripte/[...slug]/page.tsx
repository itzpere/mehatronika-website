import { FolderIcon, FileTextIcon, VideoIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { CommentsProvider, CommentSidebar } from '@/components/skripte/comments-sidebar'
import { getFileIcon } from '@/components/skripte/file-icons'
import { getLikes, likeFile, getLikedFiles } from '@/components/skripte/file-likes'
import {
  isImage,
  isVideo,
  type FileStat,
  isFile,
  processFiles,
  getFilesFromDB,
} from '@/components/skripte/file-utils'
import { FileViewer } from '@/components/skripte/file-viewer'
import { LikeButton } from '@/components/skripte/like-button'
import Loading from './loading'

export const revalidate = 3600

const MdFileCard = ({
  file,
  path,
}: {
  file: FileStat & { title: string; description: string }
  path: string
}) => (
  <Link
    href={`/skripte/${path}/${encodeURIComponent(file.basename)}`}
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

const FileListItem = async ({
  file,
  path,
  likedFiles,
}: {
  file: FileStat
  path: string
  likedFiles: number[]
}) => {
  const likes = await getLikes(file.props.fileid)

  return (
    <div className="h-12 rounded-lg bg-muted/50 flex items-center px-4 hover:bg-muted/70 transition-colors group">
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
      </div>
    </div>
  )
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const path = params.slug.map(decodeURIComponent).join('/')

  try {
    // Parallel data fetching
    const [likedFiles, files] = await Promise.all([getLikedFiles(), getFilesFromDB()])

    // Filter files for current path
    const currentPathFiles = files.filter((file) => {
      const filePath = file.currentPath.slice(0, -file.fileName.length)
      return filePath === `/${path}/` || (path === '' && filePath === '/')
    })

    // Process files
    const processedFiles = await processFiles(currentPathFiles)

    if (isFile(path)) {
      const file = files.find((f) => f.currentPath === `/${path}`)
      if (!file) throw new Error('File not found')

      const extension = file.fileName.split('.').pop()?.toLowerCase() || ''
      return (
        <div className="h-full overflow-y-auto">
          <FileViewer path={file.currentPath} filename={file.fileName} extension={extension} />
        </div>
      )
    }

    return (
      <div className="h-full overflow-y-auto w-auto">
        <CommentsProvider>
          <Suspense fallback={<Loading />}>
            <div className="flex-1">
              {processedFiles.knownMdFiles.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {processedFiles.knownMdFiles.map((file, index) => (
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
                </Suspense>

                {/* Unknown MD files */}
                <Suspense>
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
                </Suspense>

                {/* Regular files */}
                <Suspense>
                  {processedFiles.regularFiles.map((file, index) => (
                    <FileListItem key={index} file={file} path={path} likedFiles={likedFiles} />
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
