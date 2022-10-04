import { useToast } from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import { CreateBlogInputType } from '../../libs/handlers/blog/types'
import { getCreatorByIdForAuthenticated } from '../../libs/db/users'
import { verifyToken } from '../../libs/auth'
import { useRouter } from 'next/router'
import { blogs } from '@prisma/client'
import { getBlogById, SingleFetchedBlog } from '../../libs/db/blogs'
import { ParsedUrlQuery } from 'querystring'
import { getDraftData } from '../../libs/editor/draft'
import EditorForm from '../../components/editor/editorForm'
import { useDraft, useEditorForm } from '../../libs/editor/hooks'
import { FormEvent } from 'react'
import { requestToEditBlog } from '../../libs/requests/blogs'

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
    const { id: userId } = await verifyToken(token)
    const blog = await getBlogById(parseInt(blogId))
    if (!blog) {
      return {
        props: {},
        redirect: {
          destination: '/',
        },
      }
    }
    const creator = await getCreatorByIdForAuthenticated(userId)

    return {
      props: { blog, creator },
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
  blog: NonNullable<SingleFetchedBlog>
}

const NewEditorPage: NextPage<NewEditorPageProps> = ({ creator, blog }) => {
  const BLOG_DRAFT_KEY = `devrant-edit-draft-${blog.id}`
  const toast = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useEditorForm({
    creatorId: creator.id,
    content: blog.content,
    title: blog.title,
    subTitle: blog.subTitle,
  })

  const { showDraftDialog, setShowDraftDialog } = useDraft(
    BLOG_DRAFT_KEY,
    watch
  )

  const handleRestoreDraft = () => {
    const draftData = getDraftData<CreateBlogInputType>(BLOG_DRAFT_KEY)
    if (!draftData) {
      handleCloseDraftDialog()
      return
    }
    Object.keys(draftData).forEach((key) => {
      setValue(
        key as keyof typeof draftData,
        draftData[key as keyof typeof draftData]
      )
    })
    handleCloseDraftDialog()
  }

  const handleCloseDraftDialog = () => {
    localStorage.removeItem(BLOG_DRAFT_KEY)
    setShowDraftDialog(false)
  }

  const onSubmit = async ({
    content,
    title,
    subTitle,
    creatorId,
  }: CreateBlogInputType) => {
    try {
      const response = await requestToEditBlog(blog.id, {
        content,
        title,
        subTitle,
        creatorId,
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
      const newBlog = (await response.json()) as blogs
      localStorage.removeItem(BLOG_DRAFT_KEY)
      await router.push(`/blogs/${newBlog.id}`)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmitForm = (e: FormEvent) => {
    handleSubmit(onSubmit)()
    e.preventDefault()
  }

  return (
    <EditorForm
      errors={errors}
      watch={watch}
      isSubmitting={isSubmitting}
      isOpen={showDraftDialog}
      register={register}
      handleSubmit={handleSubmitForm}
      onClose={handleCloseDraftDialog}
      onRestore={handleRestoreDraft}
    />
  )
}

export default NewEditorPage
