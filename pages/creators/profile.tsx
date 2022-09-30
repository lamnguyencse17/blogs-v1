import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import * as jose from 'jose'
import { JWT_SECRET } from '../../libs/configs'
import { getCreatorByIdForAuthenticated } from '../../libs/db/users'
import {
  Claim,
  UpdateAccountInputs,
  updateAccountSchema,
} from '../../libs/auth'

import {
  FieldError,
  FieldErrorsImpl,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

type CustomErrors = FieldErrorsImpl<UpdateAccountInputs> & {
  general?: FieldError
}

type ProfilePageProps = {
  creator: NonNullable<
    Awaited<ReturnType<typeof getCreatorByIdForAuthenticated>>
  >
}

const ProfilePage: NextPage<ProfilePageProps> = ({ creator }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<UpdateAccountInputs>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      email: null,
      password: '',
      newPassword: null,
      confirmPassword: null,
    },
  })
  const onSubmit: SubmitHandler<UpdateAccountInputs> = async (values) => {
    if (values.email === creator.email) {
      setError('email', {
        message: 'Old email and new email should not be the same',
      })
      return
    }
    console.log(values)
    const response = await fetch(`/api/creators/${creator.id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    })
    console.log(response)
  }
  const customError = errors as CustomErrors
  return (
    <>
      <Head>
        <title>DEV&apos;S RANT BLOGS - Your profile</title>
      </Head>
      <main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            isInvalid={
              !!errors.email ||
              !!errors.password ||
              !!errors.confirmPassword ||
              !!errors.newPassword
            }
          >
            <Box mb="6">
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                placeholder="Email"
                type="email"
                isInvalid={!!errors.email}
                {...register('email')}
                errorBorderColor="red.300"
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </Box>
            <Box mb="6">
              <FormLabel htmlFor="confirmPassword">New password</FormLabel>
              <Input
                id="newPassword"
                type="newPassword"
                placeholder="Set your new password"
                isInvalid={!!errors.newPassword}
                {...register('newPassword')}
                errorBorderColor="red.300"
              />
              <FormErrorMessage>
                {errors.newPassword && errors.newPassword.message}
              </FormErrorMessage>
            </Box>
            <Box mb="6">
              <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
              <Input
                id="confirmPassword"
                type="confirmPassword"
                placeholder="Confirm your password"
                isInvalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
                errorBorderColor="red.300"
              />
              <FormErrorMessage>
                {errors.confirmPassword && errors.confirmPassword.message}
              </FormErrorMessage>
            </Box>
            <Box mb="6">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                isInvalid={!!errors.password}
                {...register('password')}
                errorBorderColor="red.300"
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </Box>
            <Box color="red.300">
              {customError.general && customError.general.message}
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
