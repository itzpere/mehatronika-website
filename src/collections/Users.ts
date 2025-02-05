import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 7200, // 2 hours
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: true,
    },
    maxLoginAttempts: 5,
    lockTime: 600, // 10 minutes
  },
  fields: [],
}
