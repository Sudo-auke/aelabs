import type { CollectionConfig } from 'payload'

export const Counters: CollectionConfig = {
  slug: 'counters',
  admin: {
    useAsTitle: 'key',
    group: 'Statistiques',
    description: 'Compteurs globaux du site. "total-downloads" = nombre de téléchargements, "pro-interest" = nombre de personnes intéressées par la version Pro. Géré automatiquement.',
    defaultColumns: ['key', 'value'],
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'value',
      type: 'number',
      defaultValue: 0,
    },
  ],
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: () => true,
    delete: ({ req }) => req.user?.role === 'admin',
  },
}
