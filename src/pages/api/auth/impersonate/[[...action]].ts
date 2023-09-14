import { NextApiRequest, NextApiResponse } from 'next'
import jwt from "next-auth/jwt"
import { decodeToken, signToken } from '@core/jwt'
import { findUser } from '@src/auth/user.query'
import { ScroobiousSession } from '@core/types'
import { serialize } from "cookie"
import { getSessionTokenFromRequest } from '@core/cookie'

type JWTPayloadAPI = {
  id: string,
  name: string,
  email: string,
  image: string,
  capabilities: string[],
  status: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    throw new Error(`Invalid Request`)

  const parts = req.query.action as string[] ?? ["start"]
  const action = parts.join("/")

  if (action === "start") {
    startImpersonation(req, res)
  } else if (action === "stop") {
    stopImpersonation(req, res)
  }
}

const getSessionCookieValue = (token: string) => {
  const useSecureCookies = Boolean(process.env.NEXTAUTH_URL?.startsWith("https://"))
  const cookiePrefix = useSecureCookies ? '__Secure-' : ''
  const cookie = serialize(`${cookiePrefix}next-auth.session-token`, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: useSecureCookies,
    maxAge: 30 * 24 * 60 * 60 // Default max age
  });

  return cookie;
}

export const getApiTokenPayload = async (id: string) => {
  const user = await findUser({ id })

  if (!user)
    throw new Error(`Invalid user`)

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.profilePictureFile?.url,
    capabilities: user.capabilities,
    status: user.status,
  }
}

export const getSessionTokenPayload = (apiTokenPayload: JWTPayloadAPI) => ({
  name: apiTokenPayload.name,
  email: apiTokenPayload.email,
  picture: apiTokenPayload.image,
  sub: apiTokenPayload.id,
  user: apiTokenPayload
})

export const encodeSessionToken = async ({ secret, token }: jwt.JWTEncodeParams) => jwt.encode({
  secret,
  token
});

//
// POST /api/auth/impersonate
//
export async function startImpersonation(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body.reason || req.body.reason.length < 4)
      throw new Error(`Invalid Reason Provided`)

    const secret = process.env.NEXTAUTH_SECRET!
    const adminToken = getSessionTokenFromRequest(req)

    if (!adminToken)
      throw new Error(`Invalid session`)

    const sessionData = await jwt.decode({ token: adminToken, secret }) as ScroobiousSession

    // `sessionData.apiToken` signed with process.env.WARTHOG_JWT_SECRET
    const { capabilities, name, id: impersonatingFromUserId } = decodeToken(sessionData.apiToken) as JWTPayloadAPI

    console.log('impersonator user id :>> ', impersonatingFromUserId)
    console.log('impersonator user name :>> ', name)
    console.log('impersonation reason :>> ', req.body.reason)

    if (!capabilities.includes("ADMIN")) {
      console.log('impersonation ^^^ NO_PERMISSION ^^^ :>> ')
      throw new Error(`Insufficient Permission`)
    }

    const apiTokenPayload = await getApiTokenPayload(req.body.userId)
    const apiToken = signToken(apiTokenPayload)

    console.log('impersonated user id :>> ', apiTokenPayload.id)
    console.log('impersonated user name :>> ', apiTokenPayload.name)

    const token = await encodeSessionToken({
      secret,
      token: {
        ...getSessionTokenPayload(apiTokenPayload),
        impersonatingFromUserId,
        apiToken
      }
    })

    res.setHeader("Set-Cookie", getSessionCookieValue(token))
    res.redirect("/")
  } catch (err) {
    res.status(401).json({})
  }
}

//
// POST /api/auth/impersonate/stop
//
export async function stopImpersonation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const secret = process.env.NEXTAUTH_SECRET!
    const token = getSessionTokenFromRequest(req)

    if (!token)
      throw new Error(`Invalid session`)

    const sessionData = await jwt.decode({ token, secret }) as ScroobiousSession
    const { impersonatingFromUserId } = sessionData

    if (!impersonatingFromUserId)
      throw new Error(`Invalid request`)

    const apiTokenPayload = await getApiTokenPayload(impersonatingFromUserId)
    const apiToken = signToken(apiTokenPayload)
    const adminToken = await encodeSessionToken({
      secret,
      token: {
        ...getSessionTokenPayload(apiTokenPayload),
        apiToken
      }
    })

    res.setHeader("Set-Cookie", getSessionCookieValue(adminToken))
    res.redirect("/admin/users")
  } catch (err) {
    res.status(401)
  }
}
