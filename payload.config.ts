import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'
import { Users } from './src/collections/Users'
import { Solutions } from './src/collections/Solutions'
import { Downloads } from './src/collections/Downloads'
import { ContactRequests } from './src/collections/ContactRequests'
import { Media } from './src/collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  admin: {
    user: Users.slug,
    theme: 'dark',
    access: ({ req }) => req.user?.role === 'admin',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Solutions, Downloads, ContactRequests, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? 'dev-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/aelabs',
      ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
    },
  }),
  localization: {
    locales: ['fr', 'en', 'de'],
    defaultLocale: 'fr',
  },
  upload: {
    limits: {
      fileSize: 50_000_000, // 50MB
    },
  },
  sharp,
})
