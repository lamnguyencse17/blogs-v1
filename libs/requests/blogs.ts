import { CreateBlogInputType } from '../handlers/blog/types'

const headers = {
  'Content-Type': 'application/json',
  accept: 'application/json',
}

const requestBlogApi = (
  params: (string | number)[],
  method: string,
  body: string
) => {
  const parsedParams = params.reduce((acc, cur) => {
    return acc + `${cur}` + '/'
  }, '')
  return fetch(`/api/blogs/${parsedParams}`, {
    method: method,
    body,
    headers,
  })
}

export const requestToCreateBlog = (body: CreateBlogInputType) => {
  return requestBlogApi([], 'POST', JSON.stringify(body))
}

export const requestToEditBlog = (id: number, body: CreateBlogInputType) => {
  return requestBlogApi([id], 'PUT', JSON.stringify(body))
}
