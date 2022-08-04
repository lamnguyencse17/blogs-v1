import type { NextPage } from 'next'
import Head from 'next/head'
import Card from '../components/index/card'
import { GetBlogsForIndex, IndexBlogs } from '../libs/db/blogs'
import dayjs from 'dayjs'

export async function getStaticProps() {
  const blogs = await GetBlogsForIndex()

  return {
    props: {
      blogs: blogs.map((blog) => ({
        ...blog,
        updatedAt: dayjs(blog.updatedAt).unix(),
      })),
    },
    revalidate: 120,
  }
}

type HomeProps = {
  blogs: IndexBlogs
}

const Home: NextPage<HomeProps> = ({ blogs }) => {
  return (
    <div>
      <Head>
        <title>DEV&apos;S RANT BLOGS</title>
        <meta name="description" content="dev's rant blogs" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main>
        {blogs.map((blog) => (
          <Card {...blog} key={blog.id} />
        ))}
      </main>
    </div>
  )
}

export default Home
