import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import { useForm } from 'react-hook-form'
import { createBlogSchema } from '../../libs/handlers/blog/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import remarkGfm from 'remark-gfm'
import { getCreatorByIdForAuthenticated } from '../../libs/db/users'
import * as jose from 'jose'
import { Claim } from '../../libs/auth'
import { JWT_SECRET } from '../../libs/configs'
import { useRouter } from 'next/router'
import { blogs } from '@prisma/client'
import HeadingRenderer from '../../libs/markdown/headings'
import CodeRenderer from '../../libs/markdown/code'
import LinkRenderer from '../../libs/markdown/link'
import StrongRenderer from '../../libs/markdown/strong'
import ImageRenderer from '../../libs/markdown/image'
import ParagraphRenderer from '../../libs/markdown/paragraph'
import { useEffect, useState } from 'react'
import { debounce } from 'lodash-es'
import DraftDialog from '../../components/editor/draftDialog'

const LOCAL_STORAGE_DRAFT_KEY = 'editor-draft'

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

const saveDraft = debounce(
  (content: string, title: string, subTitle: string) => {
    if (!title && !subTitle && !content) {
      return
    }
    localStorage.setItem(
      LOCAL_STORAGE_DRAFT_KEY,
      JSON.stringify({ title, subTitle, content })
    )
  },
  500
)

const getDraftData = () => {
  const draftData = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY)
  console.log(draftData)
  if (!draftData) {
    return {}
  }
  return JSON.parse(draftData)
}

const NewEditorPage: NextPage<NewEditorPageProps> = ({ creator }) => {
  const toast = useToast()
  const router = useRouter()
  const [showDraftDialog, setShowDraftDialog] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<z.infer<typeof createBlogSchema>>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      creatorId: creator.id,
    },
  })

  const currentContent = watch('content')
  const currentTitle = watch('title')
  const currentSubTitle = watch('subTitle')

  useEffect(() => {
    if (!showDraftDialog) {
      saveDraft(currentContent, currentTitle, currentSubTitle)
    }
  }, [currentContent, currentTitle, currentSubTitle, showDraftDialog])

  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY)) {
      setShowDraftDialog(true)
    }
  }, [])

  const handleRestoreDraft = () => {
    const draftData = getDraftData()
    Object.keys(draftData).forEach((key) => {
      setValue(key as keyof z.infer<typeof createBlogSchema>, draftData[key])
    })
    handleCloseDraftDialog()
  }

  const handleCloseDraftDialog = () => {
    localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY)
    setShowDraftDialog(false)
  }

  const onSubmit = async ({
    content,
    title,
    subTitle,
    creatorId,
  }: z.infer<typeof createBlogSchema>) => {
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        body: JSON.stringify({
          content,
          title,
          subTitle,
          creatorId,
        }),
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      })
      if (!response.ok) {
        const { message } = await response.json()
        toast({
          title: message,
          duration: 5000,
          isClosable: true,
          status: 'error',
        })
        return
      }
      const blog = (await response.json()) as blogs
      localStorage.removeItem('devrant-draft')
      await router.push(`/blogs/${blog.id}`)
    } catch (err) {
      console.log(err)
    }
  }
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
            <Flex alignItems="center" justifyContent="center" mt="5">
              <Button isLoading={isSubmitting} type="submit">
                Submit
              </Button>
            </Flex>
            <Box id="preview">
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
                {currentContent}
              </ReactMarkdown>{' '}
            </Box>
          </FormControl>
        </form>
        <DraftDialog
          isOpen={showDraftDialog}
          onClose={handleCloseDraftDialog}
          onRestore={handleRestoreDraft}
        />
      </main>
    </Container>
  )
}

export default NewEditorPage
