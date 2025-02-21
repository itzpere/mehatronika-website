import { getWebDAVClient } from '@/components/skripte/file-utils'

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/')
  const client = getWebDAVClient()

  const file = await client.getFileContents(`/${path}`, { format: 'binary' })

  const response = new Response((file as any).data || file)
  response.headers.set('Content-Type', 'application/pdf')
  return response
}
