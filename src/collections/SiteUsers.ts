import type { CollectionConfig } from 'payload'

export const SiteUsers: CollectionConfig = {
  slug: 'site-users',
  auth: {
    cookies: {
      secure: process.env.NODE_ENV === 'production',
    },
    tokenExpiration: 604800, // 1 week
    maxLoginAttempts: 5,
    lockTime: 600, // 10 minutes
    disableLocalStrategy: true,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'password',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'googleId',
      type: 'text',
      unique: true,
      admin: { hidden: true },
    },
    {
      name: 'linkedAccounts',
      type: 'array',
      fields: [
        {
          name: 'provider',
          type: 'select',
          options: ['google'],
          required: true,
        },
        {
          name: 'providerId',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'emailVerified',
      type: 'date',
      admin: { hidden: true },
    },
  ],
}
