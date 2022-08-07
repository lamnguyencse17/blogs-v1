import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import {
  getCreatorById,
  getIdsForCreatorPath,
  SingleFetchedCreator,
} from '../../libs/db/users'
import { ParsedUrlQuery } from 'querystring'
import { Box, Container, Flex, Heading, Stack } from '@chakra-ui/react'
import Card from '../../components/creator/card'

export const getStaticPaths: GetStaticPaths = async () => {
  const creatorIds = await getIdsForCreatorPath()
  return {
    paths: creatorIds.map((id) => ({ params: { id } })),
    fallback: false, // can also be true or 'blocking'
  }
}

interface SingleCreatorContext extends ParsedUrlQuery {
  id: string
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as SingleCreatorContext
  const creator = await getCreatorById(id)
  if (!creator) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    }
  }
  return {
    props: { creator },
    revalidate: 600,
  }
}

type CreatorProps = {
  creator: NonNullable<SingleFetchedCreator>
}

const Creators: NextPage<CreatorProps> = ({ creator }) => {
  return (
    <Box>
      <Head>
        <title>DEV&apos;S RANT BLOGS - {creator.name}</title>
        <meta
          name="description"
          content={`dev's rant blogs creator ${creator.name} page`}
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Container maxW="container.lg">
        <Stack>
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            shadow="md"
            borderWidth="1px"
          >
            <Heading>{creator.name}</Heading>
          </Flex>
          <Flex direction="column" gap="10">
            {creator.blogs.map((blog) => (
              <Card {...blog} key={blog.id} creator={creator} />
            ))}
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
}

export default Creators
