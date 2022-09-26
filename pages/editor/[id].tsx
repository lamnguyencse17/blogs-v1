import { GetServerSideProps, NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'
import * as jose from 'jose'
import { JWT_SECRET } from '../../libs/configs'
import { Claim } from '../../libs/auth'
import { GetBlogById, SingleFetchedBlog } from '../../libs/db/blogs'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Code from '@tiptap/extension-code'
import { Editor as TypeEditor, JSONContent } from '@tiptap/core'
import { useContext, useEffect } from 'react'
import { UserContext } from '../_app'
import { useRouter } from 'next/router'
import { blogs } from '@prisma/client'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { createBlogSchema } from '../../libs/handlers/blog/types'
import { debounce } from 'lodash-es'
import { useEditor } from '@tiptap/react'
import Head from 'next/head'
import EditorSection from '../../components/editor'

interface EditBlogParams extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id: blogId } = context.params as EditBlogParams
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
    const { id: userId } = decoded.payload as Claim
    if (!userId) {
      throw new Error('User id not found')
    }
    const blog = await GetBlogById(parseInt(blogId))
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

type BlogProps = {
  blog: NonNullable<SingleFetchedBlog>
}

const EditBlog: NextPage<BlogProps> = ({ blog }) => {
  TiptapLink.configure({
    autolink: true,
    openOnClick: true,
    linkOnPaste: true,
  })

  Image.configure({
    inline: true,
  })

  const { user } = useContext(UserContext)
  const router = useRouter()
  const toast = useToast()
  const handleSubmitBlog = async ({
    title,
    subTitle,
    content,
    creatorId,
  }: {
    title: string
    subTitle: string
    content: string
    creatorId: number | null
  }) => {
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
  const {
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    handleChange,
    isSubmitting,
    setFieldValue,
  } = useFormik({
    initialValues: {
      title: '',
      subTitle: '',
      creatorId: user.id,
      content: '',
    },
    onSubmit: handleSubmitBlog,
    validationSchema: toFormikValidationSchema(createBlogSchema),
    validateOnBlur: true,
    validateOnChange: false,
  })

  const updateContent = (newContent: JSONContent) => {
    setFieldValue('content', JSON.stringify(newContent))
  }

  const storeContent = debounce((editor: TypeEditor) => {
    const newContent = editor.getJSON()
    updateContent(newContent)
    localStorage.setItem(
      `devrant-edit-draft-${blog.id}`,
      JSON.stringify(newContent)
    )
  }, 1000)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      TiptapLink,
      Image,
      BulletList,
      OrderedList,
      Code,
    ],
    content: JSON.parse(blog.content),
    onUpdate: ({ editor }) => {
      storeContent(editor)
    },
    onCreate: ({ editor }) => {
      const draftContent = localStorage.getItem(`devrant-edit-draft-${blog.id}`)
      if (draftContent) {
        const keepDraft = confirm('do you want to continue with the draft?')
        if (!keepDraft) {
          localStorage.removeItem(`devrant-edit-draft-${blog.id}`)
          return
        }
        const parsedContent = JSON.parse(draftContent)
        editor.commands.setContent(parsedContent)
        setFieldValue('content', draftContent)
      }
    },
  })
  useEffect(() => {
    if (user.id !== null) {
      setFieldValue('creatorId', user.id)
    }
  }, [user, setFieldValue])
  if (!editor) {
    return <CircularProgress isIndeterminate color="twitter.900" />
  }

  return (
    <Container maxW="container.lg">
      <Head>
        <title>DEV&apos;S RANT BLOGS EDITOR</title>
        <meta name="description" content="dev's rant blogs editor" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main>
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!errors.title || !!errors.subTitle}>
            <Box mb="6">
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input
                id="title"
                type="text"
                placeholder="Title"
                name="title"
                required={true}
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.title && !!touched.title}
                errorBorderColor="red.300"
                color="twitter.900"
              />
              <FormErrorMessage>
                {touched.title && errors.title}
              </FormErrorMessage>
            </Box>
            <Box mb="6">
              <FormLabel htmlFor="subTitle">Subtitle</FormLabel>
              <Input
                id="subTitle"
                type="text"
                placeholder="Subtitle"
                name="subTitle"
                required={true}
                value={values.subTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.subTitle && !!touched.subTitle}
                errorBorderColor="red.300"
                color="twitter.900"
              />
              <FormErrorMessage>
                {touched.subTitle && errors.subTitle}
              </FormErrorMessage>
            </Box>
            <Divider />
            <EditorSection editor={editor} />
            <Flex alignItems="center" justifyContent="center" mt="5">
              <Button isLoading={isSubmitting} type="submit">
                Submit
              </Button>
            </Flex>
          </FormControl>
        </form>
      </main>
    </Container>
  )
}

export default EditBlog
