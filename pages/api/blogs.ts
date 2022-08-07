import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { createBlogHandler } from '../../libs/handlers/blog/blog'

const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return createBlogHandler(req, res)
  }
}

export default handler
