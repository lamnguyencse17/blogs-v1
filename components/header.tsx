import Image from 'next/future/image'
import Link from 'next/link'
import {
  Box,
  CircularProgress,
  Flex,
  Heading,
  IconButton,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Show,
  Spacer,
} from '@chakra-ui/react'
import logo from '../public/favicon.svg'
import { useContext } from 'react'
import { UserContext } from '../pages/_app'
import { HamburgerIcon } from '@chakra-ui/icons'

const Header = () => {
  const { user } = useContext(UserContext)

  return (
    <Flex minWidth="max-content" alignItems="center" gap="2">
      <Box p="2">
        <Link href="/" passHref>
          <ChakraLink>
            <Flex alignItems="center">
              <Box mr="3" height="9" width="9">
                <Image src={logo} alt="Dev's Rant Blogs Logo" />
              </Box>
              <Heading color="twitter.900">DEV&apos;S RANT</Heading>
            </Flex>
          </ChakraLink>
        </Link>
      </Box>
      <Spacer />
      <Box>
        <Show above="sm">
          <Flex gap={3} alignItems="center">
            <Link href="/" passHref>
              <ChakraLink color="twitter.900">Home</ChakraLink>
            </Link>
            <Spacer />
            <ChakraLink
              color="twitter.900"
              href="https://www.lamnguyencse17.dev"
              isExternal
            >
              About
            </ChakraLink>
            {user.isLoading && (
              <>
                <Spacer />
                <CircularProgress isIndeterminate color="twitter.900" />
              </>
            )}
            {!user.isLoading && user.id === null && (
              <>
                <Spacer />
                <Link href="/login" passHref>
                  <ChakraLink color="twitter.900">Login</ChakraLink>
                </Link>
              </>
            )}
            {!user.isLoading && user.id !== null && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Menu"
                  icon={<HamburgerIcon />}
                  variant="outline"
                  color="twitter.900"
                >
                  Actions
                </MenuButton>
                <MenuList color="twitter.900">
                  <Link href={`/creators/${user.id}`} passHref>
                    <MenuItem as="a">{user.name}</MenuItem>
                  </Link>
                  <Link href="/editor" passHref>
                    <MenuItem as="a">Create a new blog</MenuItem>
                  </Link>
                  <Link href="/creators/account" passHref>
                    <MenuItem as="a">Your profile</MenuItem>
                  </Link>
                  <MenuDivider />
                  <Link href="/logout" passHref prefetch={false}>
                    <MenuItem as="a">Sign out</MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Show>
        <Show below="sm">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Menu"
              icon={<HamburgerIcon />}
              variant="outline"
              colorScheme="twitter"
            >
              Actions
            </MenuButton>
            <MenuList color="twitter">
              <Link href="/" passHref>
                <MenuItem as="a">Home</MenuItem>
              </Link>
              <ChakraLink href="https://www.lamnguyencse17.dev" isExternal>
                <MenuItem as="a">About</MenuItem>
              </ChakraLink>
              {!user.isLoading && user.id === null && (
                <Link href="/login" passHref>
                  <MenuItem as="a">Sign in</MenuItem>
                </Link>
              )}
              {!user.isLoading && user.id !== null && (
                <>
                  <Link href={`/creators/${user.id}`} passHref>
                    <MenuItem as="a">{user.name}</MenuItem>
                  </Link>
                  <Link href="/editor" passHref>
                    <MenuItem as="a">Create a new blog</MenuItem>
                  </Link>
                  <Link href="/creators/account" passHref>
                    <MenuItem as="a">Your Account</MenuItem>
                  </Link>
                  <MenuDivider />
                  <Link href="/logout" passHref>
                    <MenuItem as="a">Sign out</MenuItem>
                  </Link>
                </>
              )}
            </MenuList>
          </Menu>
        </Show>
      </Box>
    </Flex>
  )
}

export default Header
