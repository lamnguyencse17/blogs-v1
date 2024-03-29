import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import loginMiddleware from './middlewares/login'
import logoutMiddleware from './middlewares/logout'
import protectedMiddleware from './middlewares/protected'

const protectedRoutes = ['/editor']

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/login')) {
    return loginMiddleware(request)
  }
  if (request.nextUrl.pathname.startsWith('/logout')) {
    return logoutMiddleware(request)
  }
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    return protectedMiddleware(request)
  }
  return NextResponse.next()
}
