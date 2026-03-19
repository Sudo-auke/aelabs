import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '141.253.97.59',
      },
      {
        protocol: 'https',
        hostname: '**.neon.tech',
      },
    ],
  },
  experimental: {
    reactCompiler: false,
  },
}

export default withPayload(withNextIntl(nextConfig))
