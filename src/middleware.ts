import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import * as jose from 'jose';

const PUBLIC_ROUTES = [
  '/login',
  '/',
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/me',
  '/favicon.ico',
  '/ws'
];

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-key-seguro';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value || 
                request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token) {
    console.log('[Middleware] Token não encontrado');
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
      return NextResponse.next();
  } catch (error) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Não autorizado' }, 
        { status: 401 }
      );
    }
    
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*'
  ]
};