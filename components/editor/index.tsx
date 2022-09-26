import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import {
  TbArrowBarToLeft,
  TbArrowBarToRight,
  TbArrowsRight,
  TbBold,
  TbBoldOff,
  TbCode,
  TbCodeOff,
  TbLink,
  TbList,
  TbListNumbers,
  TbPolaroid,
  TbUnlink,
  TbAlignJustified,
  TbAlignLeft,
  TbAlignCenter,
  TbAlignRight,
  TbAntennaBarsOff,
} from 'react-icons/tb'
import { Editor, EditorContent } from '@tiptap/react'
import { useCallback } from 'react'

type EditorSectionProps = {
  editor: Editor
}

const EditorSection = ({ editor }: EditorSectionProps) => {
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
  return (
    <>
      <Flex
        direction="row"
        justifyContent="center"
        gap="3"
        width="100%"
        height="fit-content"
        mt="5"
        mb="5"
        flexFlow="wrap"
      >
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
        <Divider orientation="vertical" />
        <ButtonGroup variant="outline">
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive('heading', { level: 1 })}
            variant="solid"
          >
            H1
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive('heading', { level: 2 })}
            variant="solid"
          >
            H2
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive('heading', { level: 3 })}
            variant="solid"
          >
            H3
          </Button>
        </ButtonGroup>
        <Divider orientation="vertical" />
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
        <Divider orientation="vertical" />
        <Tooltip label="Insert an image" fontSize="md" shouldWrapChildren>
          <IconButton
            aria-label="Insert an image"
            onClick={addImage}
            variant="solid"
            icon={<TbPolaroid />}
          />
        </Tooltip>
        <Divider orientation="vertical" />
        <ButtonGroup variant="outline">
          <Tooltip label="Toggle bullet list" fontSize="md" shouldWrapChildren>
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
        <Divider orientation="vertical" />
        <br />
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

          <Tooltip label="Sink numbered list" fontSize="md" shouldWrapChildren>
            <IconButton
              aria-label="Sink numbered list"
              icon={<TbArrowBarToRight />}
              onClick={() =>
                editor.chain().focus().sinkListItem('listItem').run()
              }
              isDisabled={!editor.can().sinkListItem('listItem')}
            />
          </Tooltip>

          <Tooltip label="Lift numbered list" fontSize="md" shouldWrapChildren>
            <IconButton
              aria-label="Lift numbered list"
              icon={<TbArrowBarToLeft />}
              onClick={() =>
                editor.chain().focus().liftListItem('listItem').run()
              }
              isDisabled={!editor.can().liftListItem('listItem')}
            />
          </Tooltip>

          <Tooltip label="Split numbered list" fontSize="md" shouldWrapChildren>
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
        <ButtonGroup variant="outline">
          <Tooltip
            label="Align paragraph left"
            fontSize="md"
            shouldWrapChildren
          >
            <IconButton
              icon={<TbAlignLeft />}
              aria-label="Align paragraph left"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
            />
          </Tooltip>

          <Tooltip
            label="Align paragraph center"
            fontSize="md"
            shouldWrapChildren
          >
            <IconButton
              aria-label="Align paragraph center"
              icon={<TbAlignCenter />}
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              isActive={editor.isActive({ textAlign: 'center' })}
            />
          </Tooltip>

          <Tooltip
            label="Align paragraph right"
            fontSize="md"
            shouldWrapChildren
          >
            <IconButton
              aria-label="Align paragraph right"
              icon={<TbAlignRight />}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
            />
          </Tooltip>

          <Tooltip
            label="Align paragraph justify"
            fontSize="md"
            shouldWrapChildren
          >
            <IconButton
              aria-label="Align paragraph justify"
              icon={<TbAlignJustified />}
              onClick={() =>
                editor.chain().focus().setTextAlign('justify').run()
              }
              isActive={editor.isActive({ textAlign: 'justify' })}
            />
          </Tooltip>

          <Tooltip label="Unalign paragraph" fontSize="md" shouldWrapChildren>
            <IconButton
              aria-label="Unalign paragraph"
              icon={<TbAntennaBarsOff />}
              onClick={() => editor.chain().focus().unsetTextAlign().run()}
            />
          </Tooltip>
        </ButtonGroup>
      </Flex>

      <EditorContent editor={editor} />
    </>
  )
}

export default EditorSection
