import { syncFilesFromWebDAV } from '../hooks/webdav-sync'

// In your webdav-sync.ts or wherever you define webdavSyncJob
export const webdavSyncJob = {
  name: 'Sync files from WebDAV',
  slug: 'webdav-sync',
  handler: async () => {
    // Changed from 'execute' to 'handler'
    try {
      console.log('Starting WebDAV sync job')
      await syncFilesFromWebDAV()
      console.log('WebDAV sync job completed')
      return { success: true, output: null }
    } catch (error) {
      console.error('WebDAV sync job failed:', error)
      throw error
    }
  },
}
