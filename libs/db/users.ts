import { prisma } from './prisma'
import dayjs from 'dayjs'
import { Prisma } from '@prisma/client'

export const findUserByEmail = async (email: string) => {
  return prisma.users.findUnique({
    where: {
      email,
    },
  })
}

export const getIdsForCreatorPath = async () => {
  const creators = await prisma.users.findMany({
    select: {
      id: true,
    },
  })
  return creators.map((creator) => creator.id)
}

export const getCreatorById = async (id: string) => {
  const creator = await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      blogs: {
        select: {
          id: true,
          title: true,
          subTitle: true,
          updatedAt: true,
        },
      },
    },
  })
  if (!creator) {
    return null
  }
  return {
    ...creator,
    blogs: creator.blogs.map((blog) => ({
      ...blog,
      updatedAt: dayjs(blog.updatedAt).unix(),
    })),
  }
}

export type SingleFetchedCreator = Awaited<
  Prisma.PromiseReturnType<typeof getCreatorById>
>
