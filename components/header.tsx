import { Navbar, Spinner } from 'flowbite-react'
import Image from 'next/future/image'
import Link from 'next/link'
import logo from '../public/favicon.svg'
import useSWR, { Fetcher } from 'swr'
import { useAtom } from 'jotai'
import { userAtom } from '../store'
import { useEffect } from 'react'

const fetchUserHandler: Fetcher<string, string> = (...args) =>
  fetch(...args).then((res) => res.json())

const Header = () => {
  const [user, setUser] = useAtom(userAtom)
  const { data, error } = useSWR('/api/me', fetchUserHandler)

  useEffect(() => {
    if (data) {
      setUser((user) => ({ ...user, isLoading: false }))
    }
    if (error) {
      console.log(error)
    }
  }, [data, error, setUser])

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
        {user.isLoading && !data && <Spinner aria-label="loading" />}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
