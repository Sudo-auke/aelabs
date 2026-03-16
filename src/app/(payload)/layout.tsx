import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './admin/importMap'
import { serverFunction } from './_serverFunction'
import '@payloadcms/ui/scss/app.scss'
import '@payloadcms/next/css'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default async function PayloadLayout({ children }: LayoutProps) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
