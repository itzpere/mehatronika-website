import { CollectionConfig } from 'payload'

export const Folders: CollectionConfig = {
  slug: 'folders',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'uuid', 'parentId', 'currentPath'],
  },
  fields: [
    {
      name: 'uuid',
      type: 'number',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'currentPath',
      type: 'text',
      required: true,
    },
    {
      name: 'parentId',
      type: 'number',
      required: true,
    },
    {
      name: 'visibility',
      type: 'select',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
        { label: 'Shared', value: 'shared' },
      ],
      defaultValue: 'public',
    },
  ],
  timestamps: true,
}
