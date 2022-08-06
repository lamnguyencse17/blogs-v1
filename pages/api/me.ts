import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../libs/configs'
import { Claim, UserClaim } from '../../libs/auth'

type Data =
  | {
      message?: string
    }
  | UserClaim

export default function handler(
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
  // console.log(jwt.sign({ id: 'a', name: 'Lam Nguyen', email: 'a' }, JWT_SECRET))
  const { id, name, email } = jwt.verify(token, JWT_SECRET) as Claim
  return res.status(200).json({ id, name, email })
}
