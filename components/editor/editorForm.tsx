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
} from '@chakra-ui/react'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import DraftDialog from './draftDialog'
import HeadingRenderer from '../../libs/markdown/headings'
import CodeRenderer from '../../libs/markdown/code'
import LinkRenderer from '../../libs/markdown/link'
import StrongRenderer from '../../libs/markdown/strong'
import ImageRenderer from '../../libs/markdown/image'
import ParagraphRenderer from '../../libs/markdown/paragraph'
import remarkGfm from 'remark-gfm'
import { UseFormRegister, FieldErrorsImpl, UseFormWatch } from 'react-hook-form'
import { CreateBlogInputType } from '../../libs/handlers/blog/types'
import { FormEvent } from 'react'

type EditorFormProps = {
  watch: UseFormWatch<CreateBlogInputType>
  errors: FieldErrorsImpl<CreateBlogInputType>
  isSubmitting: boolean
  isOpen: boolean
  register: UseFormRegister<CreateBlogInputType>
  handleSubmit: (e: FormEvent) => any
  onClose: () => void
  onRestore: () => void
}

const EditorForm = ({
  watch,
  isSubmitting,
  errors,
  isOpen,
  register,
  handleSubmit,
  onClose,
  onRestore,
}: EditorFormProps) => {
  return (
    <Container maxW="container.lg">
      <Head>
        <title>DEV&apos;S RANT BLOGS EDITOR V2</title>
        <meta name="description" content="dev's rant blogs editor v2" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main>
        <form onSubmit={handleSubmit}>
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
                {watch('content')}
              </ReactMarkdown>{' '}
            </Box>
          </FormControl>
        </form>
        <DraftDialog isOpen={isOpen} onClose={onClose} onRestore={onRestore} />
      </main>
    </Container>
  )
}

export default EditorForm
