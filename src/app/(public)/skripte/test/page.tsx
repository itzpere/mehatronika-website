'use client'
import { useState, useEffect } from 'react'

export default function TestPage() {
  const [files, setFiles] = useState<string[]>([])
  const shareId = '6Yz6PRPHGYRqe7D'
  const webdavUrl = `https://${shareId}:@cloud.itzpere.com/public.php/webdav/`

  useEffect(() => {
    const listFiles = async () => {
      const response = await fetch(webdavUrl, {
        method: 'PROPFIND',
        headers: {
          Depth: '1',
        },
      })

      const data = await response.text()
      const parser = new DOMParser()
      const xml = parser.parseFromString(data, 'text/xml')
      const responses = xml.getElementsByTagName('d:response')

      const fileList = Array.from(responses)
        .map((response) => {
          const href = response.getElementsByTagName('d:href')[0].textContent
          return href?.split('/').pop() || ''
        })
        .filter((name) => name !== '')

      setFiles(fileList)
    }

    listFiles()
  }, [webdavUrl])

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Files in WebDAV Share</h2>
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file} className="p-2 hover:bg-gray-100 rounded">
              {file}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
