import type { CollectionConfig } from 'payload'

export const PageViews: CollectionConfig = {
  slug: 'page-views',
  admin: {
    useAsTitle: 'path',
    hidden: true, // kept in schema only — no longer actively used
  },
  fields: [
    { name: 'ipHash', type: 'text' },
    { name: 'path', type: 'text' },
    { name: 'referrer', type: 'text' },
    { name: 'utmSource', type: 'text' },
    { name: 'utmMedium', type: 'text' },
    { name: 'utmCampaign', type: 'text' },
    {
      name: 'scrollDepth',
      type: 'number',
      admin: { description: 'Max scroll percentage (0–100)' },
    },
    {
      name: 'timeOnPage',
      type: 'number',
      admin: { description: 'Seconds spent on page' },
    },
    { name: 'userAgent', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'timestamp', type: 'date' },
  ],
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => true,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
}
