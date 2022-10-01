import { Text } from '@chakra-ui/react'

const StrongRenderer = (props: JSX.IntrinsicElements['strong']) => {
  return (
    <Text as="span" fontWeight="bold" color="twitter.900">
      {props.children}
    </Text>
  )
}

export default StrongRenderer
