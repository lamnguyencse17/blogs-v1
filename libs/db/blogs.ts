import { Prisma } from '@prisma/client'
import { getPrismaClient } from './prisma'

export const GetBlogsForIndex = async () => {
  const prismaClient = getPrismaClient()
  const blogs = await prismaClient.blogs.findMany({
    select: {
      id: true,
      title: true,
      subTitle: true,
      updatedAt: true,
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
  return blogs
}

export type IndexBlogs = Awaited<
  Prisma.PromiseReturnType<typeof GetBlogsForIndex>
>
