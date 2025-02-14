import { authenticated } from '@/features/access/authenticated'
import type { CollectionConfig } from 'payload'


export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email'],
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
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
