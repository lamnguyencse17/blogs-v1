import { NextApiRequest, NextApiResponse } from 'next'
import { createBlogHandler } from '../../libs/handlers/blog/blog'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return createBlogHandler(req, res)
  }
}
