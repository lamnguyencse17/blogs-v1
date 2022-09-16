import { z } from 'zod'

export const createBlogSchema = z.object({
  creatorId: z.number(),
  title: z.string().trim().min(8),
  subTitle: z.string().trim().min(8),
  content: z.string(),
})
