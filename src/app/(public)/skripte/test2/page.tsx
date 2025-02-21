'use client'

export default function OfficeViewer() {
  const shareId = '6Yz6PRPHGYRqe7D'
  const fileName = 'test1.odt' // Change based on file
  const fileUrl = `https://cloud.itzpere.com/s/${shareId}/download?path=/&files=/${fileName}`

  const msViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`

  console.log(`test2 msview: ${msViewerUrl}`)
  console.log(`test2 fileUrl: ${fileUrl}`)
  return (
    <div className="container mx-auto p-4">
      <iframe src={msViewerUrl} width="100%" height="800" className="border-0" allowFullScreen />
    </div>
  )
}
