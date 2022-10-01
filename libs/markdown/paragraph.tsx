import { Element, SpecialComponents } from 'react-markdown/lib/ast-to-react'
import { NormalComponents } from 'react-markdown/lib/complex-types'
import ImageRenderer from './image'

type ComponentType = Partial<
  Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
>

const ParagraphRenderer: ComponentType['p'] = (props) => {
  const { node } = props
  const firstChild = node.children[0] as unknown as Element
  switch (firstChild.tagName) {
    case 'img':
      return ImageRenderer({ ...firstChild.properties })
    default:
      return <p>{props.children}</p>
  }
}

export default ParagraphRenderer
