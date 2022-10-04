import type { NextApiRequest, NextApiResponse } from 'next'
import { JWT_SECRET } from '../../libs/configs'
import { verifyToken } from '../../libs/auth'
import {
  getCreatorByIdForAuthenticated,
  SingleFetchedCreatorForAuthenticated,
} from '../../libs/db/users'

type Data =
  | {
      message?: string
    }
  | SingleFetchedCreatorForAuthenticated

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { Authorization: token } = req.cookies
  if (!token) {
    return res.status(401).json({})
  }
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined')
    return res.status(500).json({ message: 'Something went wrong' })
  }
  const { id } = await verifyToken(token)
  const user = await getCreatorByIdForAuthenticated(id)
  if (!user) {
    return res.status(401).json({ message: 'Unauthenticated' })
  }
  return res.status(200).json({ ...user })
}
