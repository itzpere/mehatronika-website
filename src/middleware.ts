import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path === '/login' || path === '/register') {
    try {
      // Forward the request's cookies to the API
      const sessionRes = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: request.headers,
      })

      if (!sessionRes.ok) {
        return NextResponse.next()
      }

      const session = await sessionRes.json()

      // Redirect if user is logged in
      if (session?.user) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      // Continue to the page if session check fails
      console.error('Session check failed', error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register'],
}
