import { createClient } from 'webdav'

export const davClient = createClient(process.env.WEBDAV_URL ?? '', {
  username: process.env.WEBDAV_USERNAME,
  password: process.env.WEBDAV_PASSWORD,
})
