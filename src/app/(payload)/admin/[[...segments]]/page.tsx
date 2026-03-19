import type { Metadata } from 'next'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import config from '@payload-config'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  // Payload 3.79 expects the raw Promise, not the resolved value
  return generatePageMetadata({ config, params: params as never, searchParams: searchParams as never })
}

export default async function Page({ params, searchParams }: Args) {
  return RootPage({ config, importMap, params: params as never, searchParams: searchParams as never })
}
