import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const PUBLIC_ROUTES = [
  '/login',
  '/',
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/me',
  '/favicon.ico',
  '/ws'
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log('[Middleware] Path:', pathname);
  console.log('[Middleware] Authorization:', request.headers.get('Authorization'));
  
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

  const response = NextResponse.next();
  response.headers.set('Authorization', `Bearer ${token}`);

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*'
  ]
};