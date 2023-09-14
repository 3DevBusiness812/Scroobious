// @ts-ignore
import { decode } from 'jsonwebtoken'

export function getCookie(key: string, cookies?: string) {
  if (!cookies) {
    return null
  }

  // DEBUG_AUTH: console.log(`readCookieApiToken key`, key)
  // DEBUG_AUTH: console.log(`readCookieApiToken cookies`, cookies)
  var nameEQ = `${key}=`

  var ca = cookies.split(';')

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}

export function getSessionTokenFromRequest(req: any) {
  if (!req.headers) {
    throw new Error('getSessionTokenFromRequest: req.headers is null')
  }

  const cookies = req.headers.cookie
  if (!cookies) {
    return null
  }

  return getCookie('next-auth.session-token', cookies) || getCookie('__Secure-next-auth.session-token', cookies)
}

export function getApiTokenFromRequest(req: any) {
  const sessionCookie = getSessionTokenFromRequest(req)
  if (!sessionCookie) {
    // console.log('getApigetApiTokenFromRequest: sessionCookie does not exist.  Logging in?')
    return null
  }

  let decoded
  try {
    decoded = decode(sessionCookie)
  } catch (error) {
    console.error(error)
    throw new Error('getApiTokenFromRequest: error decoding session cookie')
  }

  if (!decoded) {
    throw new Error('getApiTokenFromRequest: decoded object is empty')
  }

  const apiToken = (decoded as any).apiToken
  // DEBUG_AUTH: console.log(`apiToken`, apiToken)

  return apiToken
}
