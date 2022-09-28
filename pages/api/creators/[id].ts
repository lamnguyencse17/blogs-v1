import { creatorsPutRequestHandler } from '../../../libs/handlers/creators/put'
import AuthenticateApi, {
  AuthenticatedHandler,
} from '../../../libs/middlewares/authenticate'

const handler: AuthenticatedHandler = async (context) => {
  if (context.req.method === 'PUT') {
    return creatorsPutRequestHandler(context)
  }
}

export default AuthenticateApi(handler as AuthenticatedHandler)
