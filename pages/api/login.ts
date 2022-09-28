import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { IS_PRODUCTION, JWT_SECRET } from '../../libs/configs'
import { HiddenUserData, hideUserData, loginSchema } from '../../libs/auth'
import { findUserByEmail } from '../../libs/db/users'
import bcrypt from 'bcryptjs'
import cookie from 'cookie'

type Data =
  | {
      message?: string
    }
  | HiddenUserData

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { email, password } = loginSchema.parse(req.body)
  const user = await findUserByEmail(email)
  if (!user) {
    return {
      status: 403,
      body: {
        message: 'Invalid email or password',
      },
    }
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return {
      status: 403,
      body: {
        message: 'Invalid email or password',
      },
    }
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    {
      expiresIn: '1d',
    }
  )
  res.setHeader(
    'set-cookie',
    cookie.serialize('Authorization', token, {
      maxAge: 3600 * 24,
      expires: new Date(Date.now() + 3600 * 24),
      httpOnly: true,
      sameSite: 'strict',
      secure: IS_PRODUCTION,
      path: '/',
    })
  )
  return res.status(200).json({ ...hideUserData(user) })
}
