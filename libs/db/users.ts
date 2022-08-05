import { prisma } from './prisma'

export const findUserByEmail = async (email: string) => {
  return prisma.users.findUnique({
    where: {
      email,
    },
  })
}
