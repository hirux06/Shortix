import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const protectedRoutes = ['/dashboard', '/profile'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accesstoken')?.value; 
  const { pathname } = req.nextUrl;

  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/profile'],
};
