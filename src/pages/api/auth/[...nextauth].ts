import { decodeToken, signToken } from '@core/jwt'
import { callAPI } from '@core/request'
import { findUser } from '@src/auth/user.query'
import * as Debug from 'debug'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { PivotNextAuthAdapter } from '../../../auth/adapter'
import { getLinkedInEmail, getLinkedInPhoto } from '../../../auth/linkedin'

const debug = Debug.debug('scroobious:auth')

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    Providers.LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      scope: 'r_liteprofile,r_emailaddress',
      async profile(prof: any, tokens: any) {
        const { accessToken } = tokens
        return {
          id: prof.id,
          name: `${prof.localizedFirstName} ${prof.localizedLastName}`,
          email: await getLinkedInEmail(accessToken),
          image: await getLinkedInPhoto(accessToken),
        }
      },
    }),

    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: '' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const data = await callAPI<any>({
            variables: credentials,
            query: `
              mutation ($email: String!, $password: String!) {
                login(data: { email: $email, password: $password })  {
                  id
                  token
                }
              }
            `,
            operationName: 'login',
          })

          if (!data) {
            throw new Error('[Credential authorization error] data came back empty')
          }

          if (data.errors) {
            // console.log('data.errors :>> ', data.errors)
            return null
          }

          const decoded = decodeToken(data.token)
          debug('(authorize) decoded :>> ', decoded)

          return {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            image: decoded.image,
            capabilities: decoded.capabilities,
            status: decoded.status,
          }
        } catch (e) {
          console.error(e)
          throw new Error(`[Credential authorization error] &email=${credentials.email}`)
        }
      },
    }),
  ],

  // Create custom models: https://next-auth.js.org/tutorials/typeorm-custom-models
  adapter: PivotNextAuthAdapter({
    type: 'postgres',
    database: 'scroobious',
    synchronize: false,
  }),

  // Used to sign cookies and to sign and encrypt JSON Web Tokens
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // signingKey:
    //   '{"kty":"oct","kid":"cbbj1gGvjNLIncZdLEYWZiHIKKEqoxnbwB1ZNw6BjvE","alg":"HS512","k":"tKkWwkuMpZFcTm5xHEokIB-EpbXuFP7E8kvAZXQbMVw"}',
    // A secret to use for key generation (you should set this explicitly)
    verificationOptions: {
      algorithms: ['HS512'],
    },
  },

  pages: {
    signIn: '/auth/login', // Displays signin buttons,
  },

  callbacks: {
    async signIn(user, account, profile) {
      // DEBUG_AUTH: debug('Callback: signIn')
      debug('(signIn) user', user)
      debug('(signIn) account', account)
      debug('(signIn) profile', profile)
      return '/' // this route will always get the user back to where they're supposed to be
    },

    // redirect: async (url, baseUrl) => {
    //   debug(`url`, url)
    //   debug(`baseUrl`, baseUrl)
    //   return url.startsWith(baseUrl) ? Promise.resolve(url) : Promise.resolve(baseUrl)
    // },

    jwt: async (token, jwtUser, account, profile, isNewUser) => {
      debug('(jwt) token', token)
      debug('(jwt) jwtUser', jwtUser)
      debug('(jwt) account', account)
      debug('(jwt) profile', profile)
      debug('(jwt) isNewUser', isNewUser)

      // If we already have a valid apiToken already, we should just return it
      // There is some wonkiness in this lifecycle and I'm not sure why sometimes
      // different combination of params are passed in here.  It does seem that
      // sometimes this is called with a valid token and others it is called and we
      // should be constructing the token
      let payload
      if (token.apiToken) {
        const decoded = decodeToken(String(token.apiToken))
        if (!decoded.id) {
          // TODO: when we get here we should send them to the login page
          throw new Error(`id not found in decoded token: ${JSON.stringify(decoded)}`)
        }

        // console.log('decoded :>> ', decoded)
        const user = await findUser({ id: decoded.id })
        // console.log('user :>> ', user)

        payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.profilePictureFile?.url,
          capabilities: decoded.capabilities,
          status: user.status,
        }
      } else {
        const payloadUser = jwtUser || {} // This makes TypeScript happy so I can dot into user properties
        // Based on whether you're signing in for the first time or making subsequent requests you'll get different payloads.  This makes sure we always get a payload
        payload = {
          id: payloadUser.id || token.sub,
          email: payloadUser.email || token.email,
          image: payloadUser.image || token.picture,
          name: payloadUser.name || token.name,
          capabilities: payloadUser.capabilities || token.capabilities,
          status: payloadUser.status || token.status,
        }
      }

      const apiToken = signToken(payload)
      token.apiToken = apiToken
      token.user = payload
      return Promise.resolve(token)
    },
    async session(session, token) {
      // DEBUG_AUTH: debug('Callback: session')
      debug('session 1', session)
      debug('token', token)

      session.apiToken = token.apiToken
      session.impersonatingFromUserId = token.impersonatingFromUserId

      if (session.user && !(session as any).user.id) {
        ;(session as any).user.id = (token.user as any).id
      }

      debug('session 2', session)

      return session
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {
    error: async (error) => {
      // debug('Error in nextAuth event')
      console.error(error)
    },
  },

  // Enable debug messages in the console if you are having problems
  debug: String(process.env.NEXTAUTH_DEBUG) === 'true',
})
