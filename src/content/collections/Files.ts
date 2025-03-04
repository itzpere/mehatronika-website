import { CollectionConfig } from 'payload'

export const Files: CollectionConfig = {
  slug: 'files',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'uuid', 'parentId', 'currentPath', 'likeCount'],
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
      index: true,
    },
    {
      name: 'parentId',
      type: 'number',
      required: true,
    },
    {
      name: 'lastModified',
      type: 'date',
    },
    {
      name: 'size',
      type: 'number',
    },
    {
      name: 'type',
      type: 'text',
    },
    {
      name: 'likes',
      type: 'array',
      fields: [
        {
          name: 'likeBetterAuthUserId',
          type: 'text',
          required: true,
        },
        {
          name: 'createdAt',
          type: 'date',
          defaultValue: () => new Date(),
        },
      ],
    },
    {
      name: 'comments',
      type: 'relationship',
      relationTo: 'file-comments',
      hasMany: true,
    },
    {
      name: 'reports',
      type: 'array',
      fields: [
        {
          name: 'reportBetterAuthUserId',
          type: 'text',
          required: true,
        },
        {
          name: 'reason',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'deleted',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}
