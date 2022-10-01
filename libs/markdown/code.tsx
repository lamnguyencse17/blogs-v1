import { Text } from '@chakra-ui/react'
import { CodeComponent } from 'react-markdown/lib/ast-to-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vsDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const CodeRenderer: CodeComponent = ({
  inline,
  className,
  children,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || '')
  return !inline && match ? (
    <SyntaxHighlighter
      language={match[1]}
      PreTag="div"
      {...props}
      style={vsDark}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <Text
      as="span"
      color="twitter.900"
      fontStyle="italic"
      fontWeight="semibold"
      backgroundColor="gray.100"
    >
      {children}
    </Text>
  )
}

export default CodeRenderer
