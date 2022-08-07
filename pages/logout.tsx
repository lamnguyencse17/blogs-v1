import Head from 'next/head'
import { useContext, useEffect } from 'react'
import { CircularProgress, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { UserContext } from './_app'
import { userContextInitialValue } from '../libs/store'

const Logout = () => {
  const router = useRouter()
  const { setUser } = useContext(UserContext)
  useEffect(() => {
    const timedRedirect = setTimeout(async () => {
      if (setUser) {
        setUser({ ...userContextInitialValue, isLoading: false })
      }
      await router.push('/')
    }, 2000)
    return () => {
      clearTimeout(timedRedirect)
    }
  }, [router, setUser])
  return (
    <div className="flex flex-col mx-auto items-center justify-center min-h-full">
      <Head>
        <title>DEV&apos;S RANT BLOGS LOGOUT</title>
        <meta name="description" content="dev's rant blogs logout page" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Heading color="twitter.900">We are working on it...</Heading>
      <div className="h-8 w-8">
        <CircularProgress isIndeterminate color="twitter.900" />
      </div>
    </div>
  )
}

export default Logout
