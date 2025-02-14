import Link from 'next/link'
import { createClient } from 'webdav'
import { Header } from '@/components/skripte/header'

interface FileStat {
  basename: string
  // Add other properties if needed
}

interface PageProps {
  params: { slug: string[] }
}

export default async function Page({ params }: PageProps) {
  const path = params.slug.map((segment) => decodeURIComponent(segment)).join('/')

  const client = createClient(process.env.WEBDAV_URL ?? '', {
    username: process.env.WEBDAV_USERNAME,
    password: process.env.WEBDAV_PASSWORD,
    headers: {
      'User-Agent': 'MyWebDAVClient/1.0',
    },
  })

  const files = (await client.getDirectoryContents(`/${path}`)) as FileStat[]

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        href="/skripte"
        linkName="Scripts"
        pageName={decodeURIComponent(params.slug[params.slug.length - 1])}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          {files.map((file, index) => (
            <Link
              key={index}
              href={`/skripte/${path}/${encodeURIComponent(file.basename)}`}
              className="aspect-video h-12 w-full rounded-lg bg-muted/50 flex items-center px-4 hover:bg-muted/70 transition-colors"
            >
              {file.basename}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
