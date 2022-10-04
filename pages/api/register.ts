import type { NextApiRequest, NextApiResponse } from 'next'
import * as jose from 'jose'
import { IS_PRODUCTION, JWT_SECRET } from '../../libs/configs'
import { HiddenUserData, hideUserData, registerSchema } from '../../libs/auth'
import { createUser, findUserByEmail } from '../../libs/db/users'
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
  const { email, password, name } = registerSchema.parse(req.body)
  const user = await findUserByEmail(email)
  if (user) {
    return {
      status: 400,
      body: {
        message: 'Email already exists',
      },
    }
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await createUser({
    name,
    email,
    password: hashedPassword,
    avatar: 'https://ui-avatars.com/api/?name=' + name.replace(/ /g, '+'),
  })

  const token = await new jose.SignJWT({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_SECRET))
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
  return res.status(200).json({ ...hideUserData(newUser) })
}
