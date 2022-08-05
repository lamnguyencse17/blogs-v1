import Image from 'next/future/image'
import Link from 'next/link'
import {
  Box,
  CircularProgress,
  Flex,
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
            <Flex>
              <Image
                src={logo}
                className="mr-3 h-6 sm:h-9 w-fit"
                alt="Dev's Rant Blogs Logo"
              />
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                DEV&apos;S RANT
              </span>
            </Flex>
          </ChakraLink>
        </Link>
      </Box>
      <Spacer />
      <Box>
        <Show above="sm">
          <Flex gap={3} alignItems="center">
            <Link href="/" passHref>
              <ChakraLink>Home</ChakraLink>
            </Link>
            <Spacer />
            <Link href="/about" passHref>
              <ChakraLink colorScheme="twitter">About</ChakraLink>
            </Link>
            {user.isLoading && (
              <>
                <Spacer />
                <CircularProgress isIndeterminate color="twitter" />
              </>
            )}
            {!user.isLoading && user.id === '' && (
              <>
                <Spacer />
                <Link href="/login" passHref>
                  <ChakraLink>Login</ChakraLink>
                </Link>
              </>
            )}
            {!user.isLoading && user.id !== '' && (
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
                <MenuList color="#1A94DA">
                  <MenuItem>Create a new blog</MenuItem>
                  <MenuDivider />
                  <Link href="/logout" passHref>
                    <MenuItem as="a">Sign out</MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Show>
        <Show below="md">
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
              <Link href="/about" passHref>
                <MenuItem as="a">About</MenuItem>
              </Link>
              {!user.isLoading && user.id === '' && (
                <Link href="/login" passHref>
                  <MenuItem as="a">Sign in</MenuItem>
                </Link>
              )}
              {!user.isLoading && user.id !== '' && (
                <>
                  <MenuItem>Create a new blog</MenuItem>
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
