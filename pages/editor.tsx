import { NextPage } from 'next'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Bold from '@tiptap/extension-bold'
import {
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  Flex,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import { useCallback, useContext, useState } from 'react'
import Head from 'next/head'
import {
  TbBold,
  TbBoldOff,
  TbLink,
  TbList,
  TbPolaroid,
  TbUnlink,
  TbListNumbers,
  TbArrowBarToRight,
  TbArrowBarToLeft,
  TbArrowsRight,
  TbCodeOff,
  TbCode,
} from 'react-icons/tb'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Code from '@tiptap/extension-code'
import debounce from 'lodash-es/debounce'
import { Editor as TypeEditor } from '@tiptap/core'
import { UserContext } from './_app'
import { blogs } from '@prisma/client'
import { useRouter } from 'next/router'

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

  const [content, setContent] = useState<JSONContent>(initialContent)
  const [isSubmitting, setSubmitting] = useState(false)
  const { user } = useContext(UserContext)
  const router = useRouter()
  const handleSubmitBlog = async () => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        body: JSON.stringify({
          content: JSON.stringify(content),
          title: 'Test this title',
          subTitle: 'Test this subtitle',
          creatorId: user.id,
        }),
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      })
      if (!response.ok) {
        console.log(await response.json())
        setSubmitting(false)
        return
      }
      const blog = (await response.json()) as blogs
      localStorage.removeItem('devrant-draft')
      router.push(`/blogs/${blog.id}`)
    } catch (err) {
      setSubmitting(false)
      console.log(err)
    }
  }
  const storeContent = debounce((editor: TypeEditor) => {
    const newContent = editor.getJSON()
    setContent(newContent)
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
    content,
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
        setContent(parsedContent)
      }
    },
  })

  const setLink = useCallback(() => {
    if (!editor) {
      return
    }
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) {
      return
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()

      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])
  const addImage = useCallback(() => {
    if (!editor) {
      return
    }
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }
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
        <ButtonGroup variant="outline" spacing="6">
          <Tooltip
            label={editor.isActive('bold') ? 'Unbold' : 'Bold'}
            fontSize="md"
            shouldWrapChildren
          >
            <IconButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              variant="solid"
              aria-label="Bold"
              icon={editor.isActive('bold') ? <TbBoldOff /> : <TbBold />}
            />
          </Tooltip>
          <Tooltip
            label={editor.isActive('bold') ? 'Unset code' : 'Set code'}
            fontSize="md"
            shouldWrapChildren
          >
            <IconButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              variant="solid"
              aria-label="Code"
              icon={editor.isActive('code') ? <TbCodeOff /> : <TbCode />}
            />
          </Tooltip>
          <ButtonGroup variant="outline">
            <Tooltip label="Attach a link" fontSize="md" shouldWrapChildren>
              <IconButton
                icon={<TbLink />}
                aria-label="Attach a link"
                variant="solid"
                onClick={setLink}
                isActive={editor.isActive('link')}
              />
            </Tooltip>

            <Tooltip label="Detach a link" fontSize="md" shouldWrapChildren>
              <IconButton
                aria-label="Detach a link"
                onClick={() => editor.chain().focus().unsetLink().run()}
                isDisabled={!editor.isActive('link')}
                variant="solid"
                icon={<TbUnlink />}
              />
            </Tooltip>
          </ButtonGroup>
          <Tooltip label="Insert an image" fontSize="md" shouldWrapChildren>
            <IconButton
              aria-label="Insert an image"
              onClick={addImage}
              variant="solid"
              icon={<TbPolaroid />}
            />
          </Tooltip>

          <ButtonGroup variant="outline">
            <Tooltip
              label="Toggle bullet list"
              fontSize="md"
              shouldWrapChildren
            >
              <IconButton
                icon={<TbList />}
                aria-label="Toggle bullet list"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
              />
            </Tooltip>

            <Tooltip label="Sink bullet list" fontSize="md" shouldWrapChildren>
              <IconButton
                aria-label="Sink bullet list"
                icon={<TbArrowBarToRight />}
                onClick={() =>
                  editor.chain().focus().sinkListItem('listItem').run()
                }
                isDisabled={!editor.can().sinkListItem('listItem')}
              />
            </Tooltip>

            <Tooltip label="Lift bullet list" fontSize="md" shouldWrapChildren>
              <IconButton
                aria-label="Lift bullet list"
                icon={<TbArrowBarToLeft />}
                onClick={() =>
                  editor.chain().focus().liftListItem('listItem').run()
                }
                isDisabled={!editor.can().liftListItem('listItem')}
              />
            </Tooltip>

            <Tooltip label="Split bullet list" fontSize="md" shouldWrapChildren>
              <IconButton
                aria-label="Split bullet list"
                icon={<TbArrowsRight />}
                onClick={() =>
                  editor.chain().focus().splitListItem('listItem').run()
                }
                isDisabled={!editor.can().splitListItem('listItem')}
              />
            </Tooltip>
          </ButtonGroup>
          <ButtonGroup variant="outline">
            <Tooltip
              label="Toggle numbered list"
              fontSize="md"
              shouldWrapChildren
            >
              <IconButton
                icon={<TbListNumbers />}
                aria-label="Toggle numbered list"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
              />
            </Tooltip>

            <Tooltip
              label="Sink numbered list"
              fontSize="md"
              shouldWrapChildren
            >
              <IconButton
                aria-label="Sink numbered list"
                icon={<TbArrowBarToRight />}
                onClick={() =>
                  editor.chain().focus().sinkListItem('listItem').run()
                }
                isDisabled={!editor.can().sinkListItem('listItem')}
              />
            </Tooltip>

            <Tooltip
              label="Lift numbered list"
              fontSize="md"
              shouldWrapChildren
            >
              <IconButton
                aria-label="Lift numbered list"
                icon={<TbArrowBarToLeft />}
                onClick={() =>
                  editor.chain().focus().liftListItem('listItem').run()
                }
                isDisabled={!editor.can().liftListItem('listItem')}
              />
            </Tooltip>

            <Tooltip
              label="Split numbered list"
              fontSize="md"
              shouldWrapChildren
            >
              <IconButton
                aria-label="Split numbered list"
                icon={<TbArrowsRight />}
                onClick={() =>
                  editor.chain().focus().splitListItem('listItem').run()
                }
                isDisabled={!editor.can().splitListItem('listItem')}
              />
            </Tooltip>
          </ButtonGroup>
        </ButtonGroup>
        <EditorContent editor={editor} />
        <Flex alignItems="center" justifyContent="center">
          <Button isLoading={isSubmitting} onClick={handleSubmitBlog}>
            Submit
          </Button>
        </Flex>
      </main>
    </Container>
  )
}

export default Editor
