import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/header'
import useSWR, { Fetcher } from 'swr'
import { UserClaim } from '../libs/auth'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { userContextInitialValue } from '../libs/store'
import { Box, ChakraProvider } from '@chakra-ui/react'
import theme from '../libs/theme'

export const UserContext = createContext<{
  user: typeof userContextInitialValue
  setUser?: Dispatch<
    SetStateAction<{
      id: string
      name: string
      email: string
      isLoading: boolean
    }>
  >
}>({ user: userContextInitialValue })

const fetchUserHandler: Fetcher<UserClaim, string> = (...args) =>
  fetch(...args).then((res) => res.json())

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState(userContextInitialValue)
  const { data: fetchedUser, error } = useSWR('/api/me', fetchUserHandler)

  useEffect(() => {
    if (fetchedUser) {
      setUser((user) => ({ ...user, ...fetchedUser, isLoading: false }))
    }
    if (error) {
      console.log(error)
    }
  }, [fetchedUser, error, setUser])

  return (
    <ChakraProvider theme={theme}>
      <UserContext.Provider value={{ user, setUser }}>
        <Box marginX="12" height="100%">
          <Header />
          <Component {...pageProps} />
        </Box>
      </UserContext.Provider>
    </ChakraProvider>
  )
}

export default MyApp
