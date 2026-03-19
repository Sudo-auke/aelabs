import type { CollectionConfig } from 'payload'

export const Files: CollectionConfig = {
  slug: 'files',
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return req.user.role === 'admin' || req.user.role === 'client'
    },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  upload: {
    staticDir: 'public/files',
    // No imageSizes — binary files only
    mimeTypes: [
      'application/octet-stream',
      'application/x-msdownload',
      'application/x-msdos-program',
      'application/exe',
      'application/x-exe',
      'application/vnd.microsoft.portable-executable',
      'application/x-apple-diskimage',
      'application/zip',
      'application/x-tar',
      'application/gzip',
      'application/x-7z-compressed',
      'application/x-rar-compressed',
      'application/x-debian-package',
      'application/x-rpm',
      'application/pdf',
      'application/x-sh',
      'application/x-msi',
    ],
  },
  fields: [
    {
      name: 'description',
      type: 'text',
      localized: true,
    },
  ],
}
