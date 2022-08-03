import { env } from '$env/dynamic/private';

export const JWT_SECRET = env.JWT_SECRET === '' ? '12345' : env.JWT_SECRET;
export const IS_PRODUCTION = env.NODE_ENV === 'production';
