import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import * as jwt from 'jsonwebtoken';

const PUBLIC_ROUTES = ['/login', '/', '/api/auth/login', '/api/auth/refresh'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.headers.get('Authorization')?.split(' ')[1] || '';
  
  try {
    if (!token) throw new Error('No token');
    
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (error) {
    const refreshToken = request.cookies.get('refreshToken');
    
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      jwt.verify(refreshToken.value, process.env.REFRESH_SECRET!);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*'
  ]
};