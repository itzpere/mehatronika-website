import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { BlocksFeature, FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig, PayloadRequest } from 'payload'
import sharp from 'sharp'
import { webdavSyncJob } from '@/jobs/webdav-sync'
import { FileComments } from './content/collections/FileComments'
import { Files } from './content/collections/Files'
import { Folders } from './content/collections/Folders'
import { Kontakt } from './content/collections/Kontakt'
import { Media } from './content/collections/Media'
import { Newsletter } from './content/collections/NewsLetter'
import { Users } from './content/collections/Users'
import { user, session, account, verification } from './content/schema'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Newsletter, Kontakt, Files, Folders, FileComments],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      BlocksFeature({
        blocks: [],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },

    beforeSchemaInit: [
      ({ schema }) => {
        return {
          ...schema,
          tables: {
            ...schema.tables,
            user,
            session,
            account,
            verification,
          },
        }
      },
    ],
  }),
  sharp,
  // Run file sync every 5 minutes
  jobs: {
    tasks: [webdavSyncJob],
    autoRun: [
      {
        cron: '*/5 * * * *',
        queue: 'default',
        limit: 1, // Only one instance at a time
      },
    ],
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
  },
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
    seoPlugin({
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc.title} - Mehatronika`,
      generateDescription: ({ doc }) => doc.excerpt,
    }),
  ],
})
