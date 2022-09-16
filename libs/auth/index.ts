import { users } from '@prisma/client'
import { JwtPayload } from 'jsonwebtoken'
import { string, z } from 'zod'

export const verifyToken = () => {}

export type UserClaim = {
  id: number | null
  name: string
  email: string
}

export type Claim = UserClaim & JwtPayload

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(8),
})

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().trim().min(8),
})

export const hideUserData = (user: users) => {
  const { password: _, createdAt, updatedAt, ...userInfo } = user
  return userInfo
}

export type HiddenUserData = ReturnType<typeof hideUserData>
export type LoginSchemaType = z.infer<typeof loginSchema>
export type RegisterSchemaType = z.infer<typeof registerSchema>
