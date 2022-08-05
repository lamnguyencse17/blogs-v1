import { Spinner } from 'flowbite-react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import cookie from 'cookie'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { Authorization: token } = context.req.cookies
  if (token) {
    context.res.setHeader(
      'set-cookie',
      cookie.serialize('Authorization', '', {
        expires: new Date(Date.now() + 3600 * 24 * 1000),
        maxAge: -60 * 60 * 24,
        httpOnly: true,
        sameSite: 'strict',
      })
    )
  }
  return {
    props: {},
  }
}

const Logout = () => {
  return (
    <div className="flex flex-col mx-auto items-center justify-center min-h-full">
      <Head>
        <title>DEV&apos;S RANT BLOGS LOGOUT</title>
        <meta name="description" content="dev's rant blogs logout page" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className="text-2xl text-blue-700">We are working on it...</div>
      <div className="h-8 w-8">
        <Spinner className="text-center fill-blue-700 " size="8" />
      </div>
    </div>
  )
}

export default Logout
