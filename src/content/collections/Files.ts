import { authenticated } from '@/features/access/authenticated'
import type { CollectionConfig } from 'payload'

export const Files: CollectionConfig = {
  slug: 'files',
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'fileName',
    defaultColumns: ['fileName', 'fileId', 'modified', 'likes'],
  },
  fields: [
    {
      name: 'fileId',
      type: 'number',
      required: true,
      unique: true,
    },
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
      index: true, // For sorting
    },
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'fileName',
      type: 'text',
      index: true, // For search
    },
    {
      name: 'modified',
      type: 'date',
      index: true, // For sorting by last updated
    },
    {
      name: 'size',
      type: 'number',
    },
    {
      name: 'location',
      type: 'text',
    },
  ],
  timestamps: true,
}
