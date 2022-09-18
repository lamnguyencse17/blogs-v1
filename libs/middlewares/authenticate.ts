import { NextApiRequest, NextApiResponse } from 'next'
import { Claim } from '../auth'
import * as jose from 'jose'
import { JWT_SECRET } from '../configs'
import { getUserContext } from '../db/users'

export type AuthenticatedContext = {
  req: NextApiRequest
  res: NextApiResponse
  user: NonNullable<Awaited<ReturnType<typeof getUserContext>>>
}

export type AuthenticatedHandler = (
  context: AuthenticatedContext
) => Promise<void>

const AuthenticateApi = (apiHandler: AuthenticatedHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies['Authorization']
    if (!token) {
      return res.status(401).json({ message: 'Unauthenticated' })
    }
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )
    const userId = (payload as Claim).id
    const user = await getUserContext(userId)
    if (!user) {
      return res.status(401).json({ message: 'Unauthenticated' })
    }
    return apiHandler({ req, res, user })
  }
}

export default AuthenticateApi
