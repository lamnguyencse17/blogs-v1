import { GetServerSideProps, NextPage } from 'next'
import { Label, TextInput, Button } from 'flowbite-react'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../libs/configs'
import { Claim } from '../libs/auth'
import Head from 'next/head'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { Authorization: token } = context.req.cookies
  if (!token || !JWT_SECRET) {
    return {
      props: {},
    }
  }

  try {
    jwt.verify(token, JWT_SECRET) as Claim
  } catch (err) {
    return {
      props: {},
    }
  }
  return {
    props: {},
    redirect: {
      destination: '/',
    },
  }
}

const Login: NextPage = () => {
  return (
    <div>
      <Head>
        <title>DEV&apos;S RANT BLOGS LOGIN</title>
        <meta name="description" content="dev's rant blogs login page" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <form>
        <div className="mb-6">
          <div className="mb-2 block">
            <Label htmlFor="email">Email</Label>
          </div>
          <TextInput
            id="email"
            placeholder="Email"
            type="email"
            name="email"
            required={true}
          />
        </div>
        <div className="mb-6">
          <div className="mb-2 block">
            <Label htmlFor="password">Password</Label>
          </div>
          <TextInput
            id="password"
            type="password"
            placeholder="Password"
            name="password"
            required={true}
          />
        </div>
        <Button type="submit">Sign in</Button>
      </form>
    </div>
  )
}

export default Login
