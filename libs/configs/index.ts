export const JWT_SECRET =
  process.env.JWT_SECRET === '' ? '12345' : process.env.JWT_SECRET!
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
