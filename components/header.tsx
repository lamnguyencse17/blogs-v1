import { Navbar, Spinner, Dropdown } from 'flowbite-react'
import Image from 'next/future/image'
import Link from 'next/link'
import logo from '../public/favicon.svg'
import { useContext } from 'react'
import { UserContext } from '../pages/_app'

const Header = () => {
  const { user } = useContext(UserContext)
  console.log(user)
  return (
    <Navbar
      fluid={true}
      rounded={true}
      className="px-4 border border-b-gray-400"
    >
      <Navbar.Brand href="/">
        <Image
          src={logo}
          className="mr-3 h-6 sm:h-9 w-fit"
          alt="Dev's Rant Blogs Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          DEV&apos;S RANT
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        {user.isLoading && <Spinner aria-label="loading" />}
        {!user.isLoading && user.id === '' && <Link href="/login">Login</Link>}
        {!user.isLoading && user.id !== '' && (
          <Dropdown label={user.name} inline={true}>
            <Dropdown.Item>Create a new blog</Dropdown.Item>
            <Dropdown.Divider />
            <Link href="/logout">
              <a className="block cursor-pointer py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                Sign out
              </a>
            </Link>
          </Dropdown>
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
