import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './src/i18n/routing'

const intlMiddleware = createMiddleware(routing)

const protectedRoutes = ['/client/dashboard', '/client/downloads']

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Extract locale from pathname
  const locale = routing.locales.find((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`)

  // Check if the route (without locale prefix) is protected
  const pathWithoutLocale = locale ? pathname.replace(`/${locale}`, '') : pathname
  const isProtected = protectedRoutes.some((route) => pathWithoutLocale.startsWith(route))

  if (isProtected) {
    const token = request.cookies.get('payload-token')
    if (!token) {
      const loginUrl = new URL(`/${locale ?? routing.defaultLocale}/client/login`, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public|media).*)'],
}
