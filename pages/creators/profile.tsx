import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import * as jose from 'jose'
import { JWT_SECRET } from '../../libs/configs'
import { getCreatorByIdForAuthenticated } from '../../libs/db/users'
import { Claim } from '../../libs/auth'
import { useFormik } from 'formik'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies['Authorization']
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    }
  }
  try {
    const decoded = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )
    const { id } = decoded.payload as Claim
    if (!id) {
      throw new Error('User id not found')
    }
    const creator = await getCreatorByIdForAuthenticated(id)
    return {
      props: { creator },
    }
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    }
  }
}

type ProfilePageProps = {
  creator: Awaited<ReturnType<typeof getCreatorByIdForAuthenticated>>
}

const ProfilePage: NextPage<ProfilePageProps> = () => {
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
      confirmPassword: '',
    },
    onSubmit: async () => {
      // if (setUser) {
      //   setUser({ ...user, isLoading: true })
      // }
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   body: JSON.stringify(values),
      //   headers: {
      //     'Content-Type': 'application/json',
      //     accept: 'application/json',
      //   },
      // })
      // if (!response.ok) {
      //   const { message } = await response.json()
      //   toast({
      //     title: message,
      //     duration: 5000,
      //     isClosable: true,
      //     status: 'error',
      //   })
      //   return
      // }
      // const userData = (await response.json()) as HiddenUserData
      // if (setUser) {
      //   setUser({ ...userData, isLoading: false })
      // }
    },
    // validationSchema: toFormikValidationSchema(loginSchema),
  })
  return (
    <>
      <Head>
        <title>DEV&apos;S RANT BLOGS - Your profile</title>
      </Head>
      <main>
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
              <FormErrorMessage>
                {touched.email && errors.email}
              </FormErrorMessage>
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
                Update
              </Button>
            </Box>
          </FormControl>
        </form>
      </main>
    </>
  )
}

export default ProfilePage
