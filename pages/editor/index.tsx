import { useToast } from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import { CreateBlogInputType } from '../../libs/handlers/blog/types'
import { getCreatorByIdForAuthenticated } from '../../libs/db/users'
import { verifyToken } from '../../libs/auth'
import { useRouter } from 'next/router'
import { blogs } from '@prisma/client'
import { getDraftData } from '../../libs/editor/draft'
import EditorForm from '../../components/editor/editorForm'
import { useEditorForm, useDraft } from '../../libs/editor/hooks'
import { requestToCreateBlog } from '../../libs/requests/blogs'
import { FormEvent } from 'react'

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
    const { id: userId } = await verifyToken(token)
    const creator = await getCreatorByIdForAuthenticated(userId)
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

const EditorPage: NextPage<NewEditorPageProps> = ({ creator }) => {
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
  })

  const { showDraftDialog, setShowDraftDialog } = useDraft(
    LOCAL_STORAGE_DRAFT_KEY,
    watch
  )

  const handleRestoreDraft = () => {
    const draftData = getDraftData<CreateBlogInputType>(LOCAL_STORAGE_DRAFT_KEY)
    if (draftData) {
      Object.keys(draftData).forEach((key) => {
        setValue(
          key as keyof CreateBlogInputType,
          draftData[key as keyof typeof draftData]
        )
      })
    }
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
  }: CreateBlogInputType) => {
    try {
      const response = await requestToCreateBlog({
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
      const blog = (await response.json()) as blogs
      localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY)
      await router.push(`/blogs/${blog.id}`)
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

export default EditorPage
