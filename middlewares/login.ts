import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { JWT_SECRET } from '../libs/configs'
import { verifyToken } from '../libs/auth'

export default async function loginMiddleware(request: NextRequest) {
  const token = request.cookies.get('Authorization')
  if (!token || !JWT_SECRET) {
    return NextResponse.next()
  }
  const isValid = await verifyToken(token)
  if (!isValid) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/', request.url))
}
