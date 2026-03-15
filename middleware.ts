import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './src/i18n/routing'

const intlMiddleware = createMiddleware(routing)

const protectedPaths = ['/client/dashboard', '/client/downloads']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if current path (stripped of locale) is protected
  const locale = routing.locales.find(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
  )
  const pathWithoutLocale = locale ? pathname.slice(locale.length + 1) : pathname

  if (protectedPaths.some((p) => pathWithoutLocale.startsWith(p))) {
    const token = request.cookies.get('payload-token')
    if (!token) {
      const loginUrl = new URL(
        `/${locale ?? routing.defaultLocale}/client/login`,
        request.url,
      )
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  // Match all paths except Next.js internals, API routes and static assets
  matcher: ['/((?!_next|api|favicon\\.ico|.*\\..*).*)'],
}
