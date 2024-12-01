// middleware.ts
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import * as jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-key-seguro'

const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register'
]

const protectedPaths = [
  '/dashboard',
  '/dashboard/cultos',
  '/dashboard/usuarios',
  '/administrativo'
]

export function middleware(request: NextRequest) {
  // Obtém o token do localStorage via header
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Debug
  console.log('Path:', request.nextUrl.pathname)
  console.log('Token:', token)
  console.log('Is protected:', isProtectedRoute)
  console.log('Is public:', isPublicRoute)

  // Redireciona para dashboard se tentar acessar login com token
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redireciona para login se tentar acessar rota protegida sem token
  if (!isPublicRoute && !token) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verifica validade do token para rotas protegidas
  if (!isPublicRoute) {
    try {
      const decoded = jwt.verify(token!, JWT_SECRET)
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('user', JSON.stringify(decoded))
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/dashboard/:path*', // Inclui todas as subrotas do dashboard
    '/administrativo/:path*'
  ]
}