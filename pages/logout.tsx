import Head from 'next/head'
import { useContext, useEffect } from 'react'
import { Box, CircularProgress, Heading } from '@chakra-ui/react'
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
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Head>
        <title>DEV&apos;S RANT BLOGS LOGOUT</title>
        <meta name="description" content="dev's rant blogs logout page" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Heading color="twitter.900">We are working on it...</Heading>
      <Box height="8" width="8">
        <CircularProgress isIndeterminate color="twitter.900" />
      </Box>
    </Box>
  )
}

export default Logout
