import { NextPage } from 'next'
import { useEditor, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Bold from '@tiptap/extension-bold'
import {
  Button,
  CircularProgress,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { useContext, useEffect } from 'react'
import Head from 'next/head'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Code from '@tiptap/extension-code'
import debounce from 'lodash-es/debounce'
import { Editor as TypeEditor } from '@tiptap/core'
import { UserContext } from './_app'
import { blogs } from '@prisma/client'
import { useRouter } from 'next/router'
import EditorSection from '../components/editor'
import { useFormik } from 'formik'
import { CreateBlogSchema } from '../libs/handlers/blog/types'
import { toFormikValidationSchema } from 'zod-formik-adapter'

const initialContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello World! 🌎️ ',
        },
      ],
    },
  ],
}

const Editor: NextPage = () => {
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
  const handleSubmitBlog = async ({
    title,
    subTitle,
    content,
    creatorId,
  }: {
    title: string
    subTitle: string
    content: string
    creatorId: string
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
        console.log(await response.json())
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
    validationSchema: toFormikValidationSchema(CreateBlogSchema),
  })
  const updateContent = (newContent: JSONContent) => {
    setFieldValue('content', JSON.stringify(newContent))
  }
  const storeContent = debounce((editor: TypeEditor) => {
    const newContent = editor.getJSON()
    updateContent(newContent)
    localStorage.setItem('devrant-draft', JSON.stringify(newContent))
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
    content: initialContent,
    onUpdate: ({ editor }) => {
      storeContent(editor)
    },
    onCreate: ({ editor }) => {
      const draftContent = localStorage.getItem('devrant-draft')
      if (draftContent) {
        const keepDraft = confirm('do you want to continue with the draft?')
        if (!keepDraft) {
          localStorage.removeItem('devrant-draft')
          return
        }
        const parsedContent = JSON.parse(draftContent)
        editor.commands.setContent(parsedContent)
        setFieldValue('content', draftContent)
      }
    },
  })
  useEffect(() => {
    if (user.id !== '') {
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
            <div className="mb-6">
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
            </div>
            <div className="mb-6">
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
            </div>
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

export default Editor
