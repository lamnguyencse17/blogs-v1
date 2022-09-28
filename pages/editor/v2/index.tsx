import {
  Box,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import { useForm } from 'react-hook-form'
import { createBlogSchema } from '../../../libs/handlers/blog/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import remarkGfm from 'remark-gfm'
import { getCreatorByIdForAuthenticated } from '../../../libs/db/users'
import * as jose from 'jose'
import { Claim } from '../../../libs/auth'
import { JWT_SECRET } from '../../../libs/configs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vsDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies['Authorization']
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    }
  }
  try {
    const decoded = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )
    const { id } = decoded.payload as Claim
    if (!id) {
      throw new Error('User id not found')
    }
    const creator = await getCreatorByIdForAuthenticated(id)
    return {
      props: { creator },
    }
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    }
  }
}

type NewEditorPageProps = {
  creator: NonNullable<
    Awaited<ReturnType<typeof getCreatorByIdForAuthenticated>>
  >
}

const NewEditorPage: NextPage<NewEditorPageProps> = ({ creator }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<z.infer<typeof createBlogSchema>>({
    resolver: zodResolver(createBlogSchema),
  })
  const onSubmit = (data: any) => console.log(data)
  useEffect(() => {
    setValue('creatorId', creator.id)
  }, [])
  return (
    <Container maxW="container.lg">
      <Head>
        <title>DEV&apos;S RANT BLOGS EDITOR V2</title>
        <meta name="description" content="dev's rant blogs editor v2" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input id="title" placeholder="Title" {...register('title')} />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
            <FormLabel htmlFor="subTitle">Subtitle</FormLabel>
            <Input
              id="subTitle"
              placeholder="Subtitle"
              {...register('subTitle')}
            />
            <FormErrorMessage>
              {errors.subTitle && errors.subTitle.message}
            </FormErrorMessage>
            <FormErrorMessage>
              {errors.content && errors.content.message}
            </FormErrorMessage>
            <FormLabel htmlFor="content">Content</FormLabel>
            <Textarea id="content" {...register('content')} height="300px" />
            <Box id="preview">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        children={String(children).replace(/\n$/, '')}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                        style={vsDark}
                      />
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {watch('content')}
              </ReactMarkdown>{' '}
            </Box>
          </FormControl>
        </form>
      </main>
    </Container>
  )
}

export default NewEditorPage
