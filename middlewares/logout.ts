import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { JWT_SECRET } from '../libs/configs'
import jwt from '@tsndr/cloudflare-worker-jwt'

export default async function logoutMiddleware(request: NextRequest) {
  const token = request.cookies.get('Authorization')
  if (!token || !JWT_SECRET) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  const isValid = await jwt.verify(token, JWT_SECRET)
  if (isValid) {
    const response = NextResponse.next()
    response.cookies.set('Authorization', '', {
      expires: new Date(Date.now() - 3600 * 24 * 1000),
      maxAge: -60 * 60 * 24,
      httpOnly: true,
      sameSite: 'strict',
    })
    return response
  }
  return NextResponse.redirect(new URL('/', request.url))
}
