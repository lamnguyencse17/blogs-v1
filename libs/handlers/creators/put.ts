import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { UpdateAccountInputs, updateAccountSchema } from '../../auth'
import { AuthenticatedHandler } from '../../middlewares/authenticate'
import bcrypt from 'bcryptjs'
import { updateUser } from '../../db/users'

export const creatorsPutRequestHandler: AuthenticatedHandler = async ({
  req,
  res,
  user,
}) => {
  const { id } = req.query
  if (!id) {
    return res.status(400).json({ message: 'Missing creator id' })
  }
  const creatorId = parseInt(id as string)
  try {
    const payload = updateAccountSchema.parse(req.body)
    if (creatorId !== user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const isCorrectPassword = await bcrypt.compare(
      payload.password,
      user.password
    )
    if (!isCorrectPassword) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const updateData: Prisma.usersUpdateInput = {}
    if (payload.email) {
      updateData['email'] = payload.email
    }
    if (payload.newPassword) {
      const hashedPassword = await bcrypt.hash(payload.newPassword, 10)
      updateData['password'] = hashedPassword
    }
    const newUser = await updateUser(user.id, updateData)
    return res.status(200).json({ ...newUser })
  } catch (err) {
    const validationErr = err as z.ZodError<UpdateAccountInputs>
    return res.status(400).json(validationErr)
  }
}
