import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { BlocksFeature, FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { Footer } from '@/components/layout/Footer/config'
import { Header } from '@/components/layout/Header/config'
import { Files } from './content/collections/Files'
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
  collections: [Users, Media, Newsletter, Kontakt, Files],
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
  globals: [Footer, Header],
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
