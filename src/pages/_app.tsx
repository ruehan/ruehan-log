import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr/_internal'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => 
          fetch(url).then((response) => response.json())
      }}>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </SWRConfig>
  )
  
}
