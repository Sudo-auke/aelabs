import type { CollectionConfig } from 'payload'

export const ProInterest: CollectionConfig = {
  slug: 'pro-interest',
  admin: {
    useAsTitle: 'email',
    group: 'Statistiques',
    description: 'Personnes ayant cliqué "Je suis intéressé par la Pro" sur le site. Lecture seule — géré automatiquement.',
    defaultColumns: ['email', 'country', 'timestamp'],
  },
  fields: [
    {
      name: 'ipHash',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    { name: 'email', type: 'email' },
    { name: 'userAgent', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'timestamp', type: 'date' },
  ],
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
}
