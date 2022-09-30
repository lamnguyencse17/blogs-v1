import { Heading } from '@chakra-ui/react'
import { HeadingComponent } from 'react-markdown/lib/ast-to-react'

const tagSizeMap = {
  h1: 'lg',
  h2: 'md',
  h3: 'sm',
}

const tagMarginMap = {
  h1: '2rem',
  h2: '1.5rem',
  h3: '1rem',
}

const GenericHeading: HeadingComponent = (props) => {
  return (
    <Heading
      size={tagSizeMap[props.node.tagName as keyof typeof tagSizeMap]}
      marginY={tagMarginMap[props.node.tagName as keyof typeof tagMarginMap]}
    >
      {props.children}
    </Heading>
  )
}

const HeadingRenderer = {
  h1: GenericHeading,
  h2: GenericHeading,
  h3: GenericHeading,
}

export default HeadingRenderer
