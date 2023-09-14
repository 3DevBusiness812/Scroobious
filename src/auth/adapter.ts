import { initializeApollo } from '@core/apollo-client'
import { createHash, randomBytes } from 'crypto'
import * as Debug from 'debug'
import type { Adapter } from 'next-auth/adapters'
import { getM2MToken } from '../core/jwt'
import {
  nextAuthCreateAuthAccountMutation,
  nextAuthCreateSessionMutation,
  nextAuthCreateUserMutation,
  nextAuthCreateVerificationRequestMutation,
  nextAuthDeleteAuthAccountMutation,
  nextAuthDeleteSessionMutation,
  nextAuthDeleteUserMutation,
  nextAuthGetSessionQuery,
  nextAuthGetVerificationRequestQuery,
  nextAuthUpdateSessionMutation,
  nextAuthUpdateUserMutation,
  nextAuthUserByEmailQuery,
  nextAuthUserByIdQuery,
  nextAuthUserByProviderAuthAccountIdQuery,
} from './adapter.gql'

const debug = Debug.debug('scroobious:auth')

export const PivotNextAuthAdapter: Adapter<
  any, // Prisma.PrismaClient,
  any, // never,
  any, // Prisma.User,
  any, // Profile & { emailVerified?: Date },
  any // Prisma.Session
> = () => {
  return {
    async getAdapter({ session, secret, ...appOptions }) {
      const M2M_TOKEN = getM2MToken()

      // TODO: is this secure?  Is there a better way?
      const client = initializeApollo({ headers: { authorization: M2M_TOKEN } })

      const sessionMaxAge = session.maxAge * 1000 // default is 30 days
      const sessionUpdateAge = session.updateAge * 1000 // default is 1 day

      /**
       * @todo Move this to core package
       * @todo Use bcrypt or a more secure method
       */
      const hashToken = (token: string) => createHash('sha256').update(`${token}${secret}`).digest('hex')

      const suppressAsyncError = async function suppressAsyncError(promise: Promise<any>) {
        let result
        try {
          result = await promise
          return result
        } catch (error) {
          debug('Suppressing sync error', JSON.stringify(error))
          return Promise.resolve(null)
        }
      }

      return {
        displayName: 'Scroobious',
        async createUser(profile) {
          debug('(adapter) createUser profile', profile)
          const result = await client.mutate<any>({
            mutation: nextAuthCreateUserMutation,
            variables: {
              data: {
                name: profile.name,
                password: profile.password,
                email: profile.email || `${profile.login}@scroobiousapp.com`, // TODO: this isn't going to fly - need to do email/password login
                profilePictureFileId: profile.image,
              },
            },
          })

          // DEBUG_AUTH: console.log('DATA', result && result.data && result.data.createUser)

          return result && result.data && result.data.createUser
        },

        async getUser(id) {
          debug('(adapter) getUser', id)
          const result = await suppressAsyncError(
            client.query<any>({
              query: nextAuthUserByIdQuery,
              variables: {
                where: {
                  id,
                },
              },
            }),
          )

          return result && result.data && result.data.user
        },

        async getUserByEmail(email) {
          debug('(adapter) getUserByEmail', email)
          if (!email) return Promise.resolve(null)

          const result = await suppressAsyncError(
            client.query<any>({
              query: nextAuthUserByEmailQuery,
              variables: {
                where: {
                  email,
                },
              },
            }),
          )

          return result && result.data && result.data.user
        },

        async updateUser(user) {
          debug('(adapter) updateUser', user)
          const result = await client.mutate<any>({
            mutation: nextAuthUpdateUserMutation,
            variables: {
              where: { id: user.id },
              data: { ...user },
            },
          })

          return result && result.data && result.data.updateUser
        },

        async deleteUser(userId) {
          const result = await client.mutate<any>({
            mutation: nextAuthDeleteUserMutation,
            variables: {
              where: {
                id: userId,
              },
            },
          })

          return result && result.data && result.data.deleteUser
        },

        async getUserByProviderAccountId(providerId, providerAccountId) {
          debug('(adapter) getUserByProviderAccountId', providerId, providerAccountId)
          let result
          try {
            result = await client.query<{ authAccounts: any[] }>({
              query: nextAuthUserByProviderAuthAccountIdQuery,
              variables: {
                where: {
                  providerId_eq: providerId.toString(),
                  providerAccountId_eq: providerAccountId.toString(),
                },
              },
            })
          } catch (error) {
            console.error(error)
            console.error('getUserByProviderAccountId error', error)
            throw new Error(String(error))
          }
          debug('(adapter) getUserByProviderAccountId: firing off query')
          debug('(adapter) result', result)

          return (
            (result &&
              result.data &&
              result.data.authAccounts &&
              result.data.authAccounts.length &&
              result.data.authAccounts[0].user) ??
            null
          )
        },

        async linkAccount(
          userId,
          providerId,
          providerType,
          providerAccountId,
          refreshToken,
          accessToken,
          accessTokenExpires,
        ) {
          debug(
            '(adapter) linkAccount',
            userId,
            providerId,
            providerType,
            providerAccountId,
            refreshToken,
            accessToken,
            accessTokenExpires,
          )

          const result = await client.mutate<any>({
            mutation: nextAuthCreateAuthAccountMutation,
            variables: {
              data: {
                userId,
                providerId: providerId.toString(),
                providerType,
                providerAccountId: providerAccountId.toString(),
                refreshToken,
                accessToken,
                accessTokenExpires,
              },
            },
          })

          return result && result.data && result.data.createAuthAccount
        },

        async unlinkAccount(_, providerId, providerAccountId) {
          const result = await client.mutate<any>({
            mutation: nextAuthDeleteAuthAccountMutation,
            variables: {
              where: {
                providerId_eq: providerId.toString(),
                providerAccountId_eq: providerAccountId.toString(),
              },
            },
          })

          return result && result.data && result.data.deleteAuthAccount
        },

        async createSession(user) {
          debug('(adapter) createSession', user)
          const result = await client.mutate<any>({
            mutation: nextAuthCreateSessionMutation,
            variables: {
              data: {
                userId: user.id,
                expires: new Date(Date.now() + sessionMaxAge),
                sessionToken: randomBytes(32).toString('hex'),
                accessToken: randomBytes(32).toString('hex'),
              },
            },
          })

          return result && result.data && result.data.createSession
        },

        async getSession(sessionToken) {
          debug('(adapter) getSession', sessionToken)
          const result = await suppressAsyncError(
            client.query<any>({
              query: nextAuthGetSessionQuery,
              variables: {
                where: {
                  sessionToken,
                },
              },
            }),
          )

          return result && result.data && result.data.session
        },

        async updateSession(session, force) {
          if (!force && Number(session.expires) - sessionMaxAge + sessionUpdateAge > Date.now()) {
            return null
          }

          const result = await client.mutate<any>({
            mutation: nextAuthUpdateSessionMutation,
            variables: {
              where: { id: session.id },
              data: {
                expires: new Date(Date.now() + sessionMaxAge),
              },
            },
          })

          return result && result.data && result.data.updateSession
        },

        async deleteSession(sessionToken) {
          const result = await client.mutate<any>({
            mutation: nextAuthDeleteSessionMutation,
            variables: { where: { sessionToken } },
          })

          return result && result.data && result.data.deleteSession
        },

        async createVerificationRequest(identifier, url, token, _, provider) {
          const result = await client.mutate<any>({
            mutation: nextAuthCreateVerificationRequestMutation,
            variables: {
              data: {
                identifier,
                token: hashToken(token),
                expires: new Date(Date.now() + provider.maxAge * 1000),
              },
            },
          })

          await provider.sendVerificationRequest({
            identifier,
            url,
            token,
            baseUrl: appOptions.baseUrl,
            provider,
          })

          return result && result.data && result.data.createVerificationRequest
        },

        async getVerificationRequest(identifier, token) {
          const result = await client.query<any>({
            query: nextAuthGetVerificationRequestQuery,
            variables: {
              where: { identifier_eq: identifier, token_eq: hashToken(token), expires_gte: new Date() },
            },
          })

          return result && result.data && result.data.verificationRequests
        },

        async deleteVerificationRequest(identifier, token) {
          const result = await client.mutate<any>({
            mutation: nextAuthCreateVerificationRequestMutation,
            variables: {
              where: {
                identifier_eq: identifier,
                token_eq: hashToken(token),
              },
            },
          })

          return result && result.data && result.data.deleteVerificationRequest
        },
      }
    },
  }
}
