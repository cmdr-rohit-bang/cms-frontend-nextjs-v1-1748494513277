import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for auth routes and static files
  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-out')
  ) {
    return NextResponse.next()
  }

  // Get the user's session token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Handle localhost:3000 (main domain - superadmin routes)
  if (host === 'localhost:3001' || host === '127.0.0.1:3001') {
    // Check if accessing admin routes
    if (pathname.startsWith('/admin')) {
      // Redirect to sign-in if not authenticated
      if (!token) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
      
      // Check if user has superadmin role
      if (token.role !== 'super_admin') {
        // Redirect to unauthorized page or sign-in
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
    
    return NextResponse.next() // Show main landing page
  }

  // Handle subdomains (demo.localhost:3000)
  const parts = host.split('.')
  if (parts.length >= 2) {
    const subdomain = parts[0]
    
    // Skip www subdomain
    if (subdomain === 'www') {
      return NextResponse.next()
    }
    
    // Check if accessing admin routes on subdomain
    if (pathname.startsWith('/admin')) {
      // Redirect to sign-in if not authenticated
      if (!token) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // Check if user has admin or superadmin role
      if (token.role !== 'owner' && token.role !== 'super_admin') {
        // Redirect to unauthorized page
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
    
    // Rewrite to tenant page
    const rewrittenPath = `/s/${subdomain}${pathname}`
    return NextResponse.rewrite(new URL(rewrittenPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}