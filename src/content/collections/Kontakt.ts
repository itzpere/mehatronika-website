import { sendEmail } from '@/lib/utils/sendEmail'
import type { CollectionConfig } from 'payload'


export const Kontakt: CollectionConfig = {
  slug: 'kontakt',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (doc.operation === 'create') {
          await sendEmail({
            to: '04.petar.miletic@domain.com',
            subject: `Kontakt - Mehatronika - ${doc.name}`,
            html: `
              <h2>Nova poruka od ${doc.name}</h2>
              <p><strong>Email:</strong> ${doc.email}</p>
              <p><strong>Poruka:</strong></p>
              <p>${doc.message}</p>
              <p><strong>Vreme:</strong> ${new Date(doc.createdAt).toLocaleString()}</p>
            `,
          })
        }
      },
    ],
  },
  timestamps: true,
}
