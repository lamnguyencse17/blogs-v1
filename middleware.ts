import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import loginMiddleware from './middlewares/login'
import logoutMiddleware from './middlewares/logout'

// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/login')) {
    return loginMiddleware(request)
  }
  if (request.nextUrl.pathname.startsWith('/logout')) {
    return logoutMiddleware(request)
  }
  return NextResponse.next()
}
