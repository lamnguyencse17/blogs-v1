import { IndexBlogs } from '../../libs/db/blogs'
import Link from 'next/link'
import {
  Box,
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
  Spacer,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useMemo } from 'react'

type CardProps = IndexBlogs[0] & { isCreator: boolean }

const Card = ({
  id,
  title,
  subTitle,
  creator,
  updatedAt,
  isCreator,
}: CardProps) => {
  const dateDifference = useMemo(() => {
    const diff = dayjs().diff(dayjs.unix(updatedAt), 'h')
    if (diff < 1) {
      const minuteDiff = dayjs().diff(dayjs.unix(updatedAt), 'minute')
      if (minuteDiff < 5) {
        return 'just now'
      }
      return `${minuteDiff}m`
    }
    if (diff > 24) {
      return `${dayjs().diff(dayjs.unix(updatedAt), 'day')}d`
    }
    return `${diff}h`
  }, [updatedAt])
  return (
    <HStack>
      <Box p={5} shadow="md" borderWidth="1px" width="100%">
        <Flex direction="row" alignItems="center">
          <Heading color="twitter.900" mb="1">
            <Link href={`/blogs/${id}`} passHref>
              <ChakraLink>{title}</ChakraLink>
            </Link>
          </Heading>
          <Spacer />
          {isCreator && (
            <Link href={`/editor/${id}`} passHref>
              <ChakraLink>Edit</ChakraLink>
            </Link>
          )}
        </Flex>

        <Flex mb="5" gap={1}>
          <Link href={`/creators/${creator.id}`} passHref>
            <ChakraLink color="twitter.600">{creator.name}</ChakraLink>
          </Link>
          <span>-</span>
          <Tooltip
            label={dayjs.unix(updatedAt).format('ddd, MMM D, YYYY h:mm A')}
          >
            {dateDifference}
          </Tooltip>
        </Flex>

        <Text mb="5" color="gray.500">
          {subTitle}
        </Text>
      </Box>
    </HStack>
  )
}

export default Card
