import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../db/prisma'
import { createBlogSchema } from './types'

export const createBlogHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const createBlogRequest = createBlogSchema.parse(req.body)
  const newBlog = await prisma.blogs.create({
    data: {
      ...createBlogRequest,
    },
  })
  return res.status(200).json({ ...newBlog })
}
