import type { NextPage } from 'next'
import Head from 'next/head'
import Card from '../components/index/card'
import { GetBlogsForIndex, IndexBlogs } from '../libs/db/blogs'
import { Container, Flex } from '@chakra-ui/react'
import { useContext } from 'react'
import { UserContext } from './_app'

export async function getStaticProps() {
  const blogs = await GetBlogsForIndex()

  return {
    props: {
      blogs,
    },
    revalidate: 120,
  }
}

type HomeProps = {
  blogs: IndexBlogs
}

const Home: NextPage<HomeProps> = ({ blogs }) => {
  const { user } = useContext(UserContext)
  return (
    <div>
      <Head>
        <title>DEV&apos;S RANT BLOGS</title>
        <meta name="description" content="dev's rant blogs" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main>
        <Container maxW="container.lg">
          <Flex direction="column" gap="10">
            {blogs.map((blog) => (
              <Card
                {...blog}
                key={blog.id}
                isCreator={user.id === blog.creator.id}
              />
            ))}
          </Flex>
        </Container>
      </main>
    </div>
  )
}

export default Home
