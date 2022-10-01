import { Flex, Image, Text } from '@chakra-ui/react'

const ImageRenderer = (props: JSX.IntrinsicElements['img']) => {
  if (!props.alt) {
    return <Image src={props.src} alt={props.alt} />
  }
  return (
    <Flex justifyContent="center" alignItems="center" direction="column">
      <Image src={props.src} alt={props.alt} />
      <Text fontWeight="bold" color="twitter.900">
        {props.alt}
      </Text>
    </Flex>
  )
}

export default ImageRenderer
