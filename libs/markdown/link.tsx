import { Link } from '@chakra-ui/react'

const LinkRenderer = (props: JSX.IntrinsicElements['a']) => {
  return (
    <Link
      href={props.href || '#'}
      isExternal
      color="twitter.900"
      fontWeight="bold"
    >
      {props.children}
    </Link>
  )
}

export default LinkRenderer
