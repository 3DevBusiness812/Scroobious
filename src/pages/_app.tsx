/* eslint-disable react/jsx-props-no-spreading */
import { ApolloProvider } from '@apollo/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { CodeListProvider } from '@core/code-list.provider'
import { PermissionsProvider, UserProvider } from '@core/user.provider'
import AlertProvider from '@core/alert.provider'
import '@src/styles/tailwind.css'
import { Provider as NextAuthProvider } from 'next-auth/client'
import Head from 'next/head'
import React from 'react'
import type { AppProps } from 'next/app'
import { useApollo } from '../core/apollo-client'
import { themeColors } from '../core/theme-colors'

const colors = {
  ...themeColors,
}
const theme = extendTheme({ colors })

// Use the <Provider> to improve performance and allow components that call
// `useSession()` anywhere in your application to access the `session` object.
function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <NextAuthProvider
        // Provider options are not required but can be useful in situations where
        // you have a short session maxAge time. Shown here with default values.
        options={{
          // Client Max Age controls how often the useSession in the client should
          // contact the server to sync the session state. Value in seconds.
          // e.g.
          // * 0  - Disabled (always use cache value)
          // * 60 - Sync session state with server if it's older than 60 seconds
          clientMaxAge: 0,
          // Keep Alive tells windows / tabs that are signed in to keep sending
          // a keep alive request (which extends the current session expiry) to
          // prevent sessions in open windows from expiring. Value in seconds.
          //
          // Note: If a session has expired when keep alive is triggered, all open
          // windows / tabs will be updated to reflect the user is signed out.
          keepAlive: 0,
        }}
        session={pageProps.session}
      >
        <Head>
          <title>Scroobious</title>
          <meta name="description" content="Scroobious" />
          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=${process.env.NEXT_PUBLIC_GTM_APP_AUTH}&gtm_preview=${process.env.NEXT_PUBLIC_GTM_APP_PREVIEW}&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_APP_ID}');`,
            }}
          />
          {/* End Google Tag Manager */}

          {/* TODO: favicon */}
          <link rel="icon" href="/favicon.png" />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
            crossOrigin="anonymous"
          />
        </Head>
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_APP_ID}&gtm_auth=${process.env.NEXT_PUBLIC_GTM_APP_AUTH}&gtm_preview=${process.env.NEXT_PUBLIC_GTM_APP_PREVIEW}&gtm_cookies_win=x"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        {/* End Google Tag Manager (noscript) */}

        <CodeListProvider>
          <UserProvider>
            <PermissionsProvider>
              <ChakraProvider theme={theme}>
                <AlertProvider>
                  <Component {...pageProps} />
                </AlertProvider>
              </ChakraProvider>
            </PermissionsProvider>
          </UserProvider>
        </CodeListProvider>
      </NextAuthProvider>
    </ApolloProvider>
  )
}

export default App
