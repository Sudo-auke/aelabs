import type { CollectionConfig } from 'payload'

export const Downloads: CollectionConfig = {
  slug: 'downloads',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return req.user.role === 'admin' || req.user.role === 'client'
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'version',
      type: 'text',
      required: true,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'solution',
      type: 'relationship',
      relationTo: 'solutions',
    },
    {
      name: 'changelog',
      type: 'richText',
      localized: true,
    },
    {
      name: 'releaseDate',
      type: 'date',
    },
  ],
}
