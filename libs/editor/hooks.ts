import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, UseFormWatch } from 'react-hook-form'
import { CreateBlogInputType, createBlogSchema } from '../handlers/blog/types'
import { saveDraft } from './draft'

export const useEditorForm = (defaultValues: Partial<CreateBlogInputType>) => {
  return useForm<CreateBlogInputType>({
    resolver: zodResolver(createBlogSchema),
    defaultValues,
  })
}

export const useDraft = (
  draftKey: string,
  watch: UseFormWatch<CreateBlogInputType>
) => {
  const [showDraftDialog, setShowDraftDialog] = useState(false)
  const content = watch('content')
  const title = watch('title')
  const subTitle = watch('subTitle')

  useEffect(() => {
    if (!showDraftDialog) {
      saveDraft(draftKey, { content, title, subTitle })
    }
  }, [content, title, subTitle, showDraftDialog])

  useEffect(() => {
    if (localStorage.getItem(draftKey)) {
      setShowDraftDialog(true)
    }
  }, [])
  return { showDraftDialog, setShowDraftDialog }
}
