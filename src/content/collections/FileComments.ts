import { CollectionConfig } from 'payload'

export const FileComments: CollectionConfig = {
  slug: 'file-comments',
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'userId', 'createdAt'],
  },
  fields: [
    {
      name: 'file',
      type: 'relationship',
      relationTo: 'files',
      required: true,
    },
    {
      name: 'userId',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'replies',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'createdAt',
          type: 'date',
          defaultValue: () => new Date(),
        },
      ],
    },
  ],
  timestamps: true,
}
