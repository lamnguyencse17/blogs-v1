import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { JWT_SECRET } from '../libs/configs'
import * as jose from 'jose'

export default async function protectedMiddleware(request: NextRequest) {
  const token = request.cookies.get('Authorization')
  if (!token || !JWT_SECRET) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  try {
    await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
