import { Prisma } from '@prisma/client'
import { prisma } from './prisma'

export const GetBlogsForIndex = async () => {
  const blogs = await prisma.blogs.findMany({
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

export const GetIdsForBlogPath = async () => {
  const blogs = await prisma.blogs.findMany({
    select: {
      id: true,
    },
  })
  return blogs.map((blog) => blog.id)
}

export type SingleBlogPath = Awaited<
  Prisma.PromiseReturnType<typeof GetIdsForBlogPath>
>

export const GetBlogById = async (id: string) => {
  const blog = await prisma.blogs.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      subTitle: true,
      content: true,
      updatedAt: true,
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
  return blog
}

export type SingleFetchedBlog = Awaited<
  Prisma.PromiseReturnType<typeof GetBlogById>
>
