import { JwtPayload } from 'jsonwebtoken'

export const verifyToken = () => {}

export type UserClaim = {
  id: string
  name: string
  email: string
}

export type Claim = UserClaim & JwtPayload
