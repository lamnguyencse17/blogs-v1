import { NextPage } from 'next'
import Head from 'next/head'
import { useFormik } from 'formik'
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'

const Login: NextPage = () => {
  const { handleSubmit, values, errors, handleChange, isSubmitting } =
    useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      onSubmit: (values) => {
        console.log(values)
      },
    })
  return (
    <div>
      <Head>
        <title>DEV&apos;S RANT BLOGS LOGIN</title>
        <meta name="description" content="dev's rant blogs login page" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <form onSubmit={handleSubmit}>
        <FormControl
          isInvalid={!!errors.email || !!errors.password}
        ></FormControl>
        <div className="mb-6">
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            placeholder="Email"
            type="email"
            name="email"
            required={true}
            value={values.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            errorBorderColor="red.300"
          />
        </div>
        <div className="mb-6">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            name="password"
            required={true}
            value={values.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            errorBorderColor="red.300"
          />
        </div>
        <div className="mx-auto w-fit">
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
        </div>
      </form>
    </div>
  )
}

export default Login
