import { NextApiRequest, NextApiResponse } from 'next'
import { canUserEditBlog, editBlog } from '../../db/blogs'
import { prisma } from '../../db/prisma'
import { createBlogSchema, editBlogSchema } from './types'

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

export const editBlogHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const editBlogRequest = editBlogSchema.parse({
    ...req.body,
    id: req.query.id,
  })
  const canEditBlog = await canUserEditBlog(
    editBlogRequest.creatorId,
    editBlogRequest.id
  )
  if (!canEditBlog) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  const updatedBlog = await editBlog(editBlogRequest.id, editBlogRequest)
  console.log(updatedBlog)
  return res.status(200).json({ ...updatedBlog })
}
