import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './src/i18n/routing'

const intlMiddleware = createMiddleware(routing)

function getRoleFromToken(token: string): string | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    // base64url → base64
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    const payload = JSON.parse(json) as Record<string, unknown>
    return typeof payload.role === 'string' ? payload.role : null
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Admin routes ---
  if (pathname.startsWith('/admin')) {
    // Always allow login / logout / forgot-password pages
    if (
      pathname === '/admin/login' ||
      pathname === '/admin/logout' ||
      pathname.startsWith('/admin/forgot-password')
    ) {
      return NextResponse.next()
    }

    const token = request.cookies.get('payload-token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const role = getRoleFromToken(token)
    if (role !== 'admin') {
      const res = NextResponse.redirect(new URL('/admin/login', request.url))
      res.cookies.set('payload-token', '', { expires: new Date(0), path: '/' })
      return res
    }

    return NextResponse.next()
  }

  // --- Frontend routes ---
  const locale = routing.locales.find(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
  )
  const pathWithoutLocale = locale ? pathname.slice(locale.length + 1) : pathname

  const isClientRoute = pathWithoutLocale.startsWith('/client')
  const isLoginRoute = pathWithoutLocale.startsWith('/client/login')

  if (isClientRoute && !isLoginRoute) {
    const token = request.cookies.get('payload-token')?.value
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
  // /admin is now included (removed from exclusion list)
  matcher: ['/((?!_next|api|favicon\\.ico|.*\\..*).*)'],
}
