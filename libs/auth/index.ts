import { users } from '@prisma/client'
import { JWTPayload } from 'jose'
// import { JwtPayload } from 'jsonwebtoken'
import { z } from 'zod'

export const verifyToken = () => {}

export type UserClaim = {
  id: number
  name: string
  email: string
}

export type Claim = UserClaim & JWTPayload

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(8),
})

export const updateAccountSchema = z
  .object({
    email: z.string().email().nullable(),
    newPassword: z.string().trim().nullable(),
    confirmPassword: z.string().trim().nullable(),
    password: z.string().trim(),
  })
  .refine((data) => !!data.email || !!data.newPassword, {
    message: 'At least one updated field is required',
    path: ['general'],
  })
  .refine((data) => !(data.password.length < 8), {
    message: 'Invalid password or missing password',
    path: ['password'],
  })
  .refine(
    ({ newPassword }) => newPassword === null || newPassword.length >= 8,
    {
      message: 'New password must be at least 8 characters',
      path: ['newPassword'],
    }
  )
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine(
    (data) =>
      data.newPassword !== data.password ||
      (!!data.newPassword && !!data.password),
    {
      message: 'Old password and new password should not be the same!',
      path: ['newPassword'],
    }
  )

export type UpdateAccountInputs = z.infer<typeof updateAccountSchema>

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
