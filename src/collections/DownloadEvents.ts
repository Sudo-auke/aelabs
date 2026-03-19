import type { CollectionConfig } from 'payload'

export const DownloadEvents: CollectionConfig = {
  slug: 'download-events',
  admin: {
    hidden: true,
    useAsTitle: 'fileName',
    defaultColumns: ['fileName', 'version', 'country', 'platform', 'timestamp'],
  },
  fields: [
    { name: 'fileName', type: 'text' },
    { name: 'version', type: 'text' },
    { name: 'ipHash', type: 'text' },
    { name: 'userAgent', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'platform', type: 'text' },
    { name: 'referrer', type: 'text' },
    { name: 'utmSource', type: 'text' },
    { name: 'timestamp', type: 'date' },
  ],
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
}
