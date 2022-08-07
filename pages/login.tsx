import { NextPage } from 'next'
import Head from 'next/head'
import { useFormik } from 'formik'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { HiddenUserData, loginSchema } from '../libs/auth'
import { useContext } from 'react'
import { UserContext } from './_app'
import { useRouter } from 'next/router'

const Login: NextPage = () => {
  const toast = useToast()
  const { user, setUser } = useContext(UserContext)
  const router = useRouter()
  const {
    handleSubmit,
    handleBlur,
    values,
    touched,
    errors,
    handleChange,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      if (setUser) {
        setUser({ ...user, isLoading: true })
      }
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      })
      if (!response.ok) {
        const { message } = await response.json()
        toast({
          title: message,
          duration: 5000,
          isClosable: true,
          status: 'error',
        })
        return
      }
      const userData = (await response.json()) as HiddenUserData
      if (setUser) {
        setUser({ ...userData, isLoading: false })
      }
      await router.push('/')
    },
    validationSchema: toFormikValidationSchema(loginSchema),
  })
  return (
    <div>
      <Head>
        <title>DEV&apos;S RANT BLOGS LOGIN</title>
        <meta name="description" content="dev's rant blogs login page" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={!!errors.email || !!errors.password}>
          <Box mb="6">
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              name="email"
              required={true}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.email && !!touched.email}
              errorBorderColor="red.300"
            />
            <FormErrorMessage>{touched.email && errors.email}</FormErrorMessage>
          </Box>
          <Box mb="6">
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              required={true}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.password && !!touched.password}
              errorBorderColor="red.300"
            />
            <FormErrorMessage>
              {touched.password && errors.password}
            </FormErrorMessage>
          </Box>
          <Box marginX="auto" width="fit-content">
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Submitting"
              colorScheme="twitter"
              size="md"
              width="10rem"
            >
              Sign in
            </Button>
          </Box>
        </FormControl>
      </form>
    </div>
  )
}

export default Login
