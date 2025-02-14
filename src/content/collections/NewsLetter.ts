import type { CollectionConfig } from 'payload'

export const Newsletter: CollectionConfig = {
  slug: 'Newsletter',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'subscription'],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'subscription',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        {
          label: 'Prva godina',
          value: 'y1',
        },
        {
          label: 'Druga godina',
          value: 'y2',
        },
        {
          label: 'Treća godina',
          value: 'y3',
        },
        {
          label: 'Četvrta godina',
          value: 'y4',
        },
      ],
      admin: {
        description: 'Izaberite godine za koje želite da primate obaveštenja',
      },
    },
    {
      name: 'subscribeToBoard',
      type: 'checkbox',
      defaultValue: true,
      label: 'Oglasna tabla',
    },
  ],
  timestamps: true,
}
