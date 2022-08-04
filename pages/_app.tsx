import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/header'
import { Provider as JotaiProvider } from 'jotai'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <div className="mx-12 h-full">
        <Header />
        <Component {...pageProps} />
      </div>
    </JotaiProvider>
  )
}

export default MyApp
