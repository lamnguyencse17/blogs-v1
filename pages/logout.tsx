import Head from 'next/head'
import { useEffect } from 'react'
import { CircularProgress, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const Logout = () => {
  const router = useRouter()
  useEffect(() => {
    const timedRedirect = setTimeout(() => {
      router.push('/')
    }, 2000)
    return () => {
      clearTimeout(timedRedirect)
    }
  }, [router])
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
