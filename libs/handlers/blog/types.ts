import { z } from 'zod'

export const createBlogSchema = z.object({
  creatorId: z.number(),
  title: z.string().trim().min(8),
  subTitle: z.string().trim().min(8),
  content: z.string(),
})

export type CreateBlogInputType = z.infer<typeof createBlogSchema>

export const editBlogSchema = z.object({
  creatorId: z.preprocess((val) => Number(val), z.number()),
  title: z.string().trim().min(8),
  subTitle: z.string().trim().min(8),
  content: z.string(),
  id: z.preprocess((val) => Number(val), z.number()),
})
