import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
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
  return blogs.map((blogs) => ({
    ...blogs,
    updatedAt: dayjs(blogs.updatedAt).unix(),
  }))
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

export const getBlogById = async (id: number) => {
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
  if (!blog) {
    return null
  }
  return { ...blog, updatedAt: dayjs(blog.updatedAt).unix() }
}

export const canUserEditBlog = async (userId: number, blogId: number) => {
  const blog = await prisma.blogs.findUnique({
    where: {
      id: blogId,
    },
    select: {
      creatorId: true,
    },
  })
  if (!blog) {
    return false
  }
  return blog.creatorId === userId
}

export const editBlog = async (
  blogId: number,
  data: Prisma.blogsUpdateInput
) => {
  return prisma.blogs.update({
    where: {
      id: blogId,
    },
    data,
  })
}

export type SingleFetchedBlog = Awaited<
  Prisma.PromiseReturnType<typeof getBlogById>
>
