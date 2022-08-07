import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { JWT_SECRET } from '../libs/configs'
import jwt from '@tsndr/cloudflare-worker-jwt'

export default async function protectedMiddleware(request: NextRequest) {
  const token = request.cookies.get('Authorization')
  if (!token || !JWT_SECRET) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  const isValid = await jwt.verify(token, JWT_SECRET)
  if (isValid) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/', request.url))
}
