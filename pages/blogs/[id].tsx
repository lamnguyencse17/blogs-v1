import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import {
  GetBlogById,
  GetIdsForBlogPath,
  SingleFetchedBlog,
} from '../../libs/db/blogs'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import dayjs from 'dayjs'

interface SingleBlogContext extends ParsedUrlQuery {
  id: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const blogIds = await GetIdsForBlogPath()
  return {
    paths: blogIds.map((id) => ({ params: { id } })),
    fallback: false, // can also be true or 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as SingleBlogContext
  const blog = await GetBlogById(id)
  if (!blog) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    }
  }
  return {
    props: { blog: { ...blog, updatedAt: dayjs(blog.updatedAt).unix() } },
    revalidate: 60,
  }
}

type BlogProps = {
  blog: NonNullable<SingleFetchedBlog>
}

const Blogs: NextPage<BlogProps> = ({ blog }) => {
  return (
    <div>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={blog.subTitle} />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main>
        <div
          dangerouslySetInnerHTML={{
            __html: generateHTML(JSON.parse(blog.content), [
              StarterKit,
              Link,
              Image,
            ]),
          }}
        />
      </main>
    </div>
  )
}

export default Blogs
