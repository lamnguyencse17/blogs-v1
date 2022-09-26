import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { createBlogHandler } from '../../../libs/handlers/blog/blog'

const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return createBlogHandler(req, res)
  }
  return res.status(404).json({ message: 'Not found' })
}

export default handler
