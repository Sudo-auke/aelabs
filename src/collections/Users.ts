import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Système',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'client'],
      defaultValue: 'client',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
  ],
}
