import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import {
  getBlogById,
  GetIdsForBlogPath,
  SingleFetchedBlog,
} from '../../libs/db/blogs'
import Link from 'next/link'
import dayjs from 'dayjs'
import {
  Container,
  Flex,
  Stack,
  StackDivider,
  Link as ChakraLink,
  Text,
  Heading,
  Box,
} from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import HeadingRenderer from '../../libs/markdown/headings'
import CodeRenderer from '../../libs/markdown/code'
import LinkRenderer from '../../libs/markdown/link'
import StrongRenderer from '../../libs/markdown/strong'
import ImageRenderer from '../../libs/markdown/image'
import ParagraphRenderer from '../../libs/markdown/paragraph'

interface SingleBlogContext extends ParsedUrlQuery {
  id: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const blogIds = await GetIdsForBlogPath()
  return {
    paths: blogIds.map((id) => ({ params: { id: id.toString() } })),
    fallback: 'blocking', // can also be true or 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as SingleBlogContext
  const blog = await getBlogById(parseInt(id))
  if (!blog) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    }
  }
  return {
    props: { blog },
    revalidate: 10,
  }
}

type BlogProps = {
  blog: NonNullable<SingleFetchedBlog>
}

const BlogsV2: NextPage<BlogProps> = ({ blog }) => {
  return (
    <div>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={blog.subTitle} />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main>
        <Container maxW="container.lg" shadow="md" borderWidth="1px">
          <Stack mb="5">
            <Flex direction="column">
              <Link href={`/creators/${blog.creator.id}`} passHref>
                <ChakraLink color="twitter.600">{blog.creator.name}</ChakraLink>
              </Link>
              <Text>
                Posted on {dayjs.unix(blog.updatedAt).format('MMMM D, YYYY')}
              </Text>
            </Flex>
            <StackDivider borderColor="gray.600" borderWidth={0.3} />
            <Heading color="twitter.900">{blog.title}</Heading>
            <Text fontSize="2xl" fontWeight="semibold" color="gray.500">
              {blog.subTitle}
            </Text>
            <Box pt="5" pb="5">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  ...HeadingRenderer,
                  code: CodeRenderer,
                  a: LinkRenderer,
                  strong: StrongRenderer,
                  img: ImageRenderer,
                  p: ParagraphRenderer,
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </Box>
          </Stack>
        </Container>
      </main>
    </div>
  )
}

export default BlogsV2
