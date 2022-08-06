import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prisma } from '../db/prisma'

export const CreateBlogSchema = z.object({
  creatorId: z.string(),
  title: z.string().min(8),
  subTitle: z.string().min(8),
  content: z.string(),
})

export const createBlogHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const createBlogRequest = CreateBlogSchema.parse(req.body)
  const newBlog = await prisma.blogs.create({
    data: {
      ...createBlogRequest,
    },
  })
  return res.status(200).json({ ...newBlog })
}
