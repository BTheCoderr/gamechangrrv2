import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Log for debugging
  console.log(`Middleware processing: ${pathname}`)

  // Redirect root path or 404 errors to the login page
  if (pathname === '/' || pathname === '/404') {
    console.log('Redirecting to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Match the root path and 404 page
export const config = {
  matcher: ['/', '/404', '/_next/404']
} 