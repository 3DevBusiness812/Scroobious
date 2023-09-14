// TODO: re-write "signToken" in both UI and API code
// @ts-ignore
import { decode, JwtPayload, sign } from 'jsonwebtoken'

export function signToken(payload: object) {
  const jwtSecret = process.env.WARTHOG_JWT_SECRET
  // DEBUG_AUTH: console.log(`jwtSecret`, jwtSecret)
  if (!jwtSecret) {
    throw new Error('Unable to find WARTHOG_JWT_SECRET')
  }

  const expiresIn = process.env.WARTHOG_JWT_EXPIRATION || '1d'

  return sign(payload, jwtSecret, {
    expiresIn,
    algorithm: 'HS512',
  })
}

export function decodeToken(token: string): JwtPayload {
  const decoded = decode(token)
  if (!decoded) {
    throw new Error(`Unable to decode token ${token}`)
  }
  return decoded as unknown as JwtPayload
}

export function getM2MToken() {
  return signToken({
    name: 'System User',
    email: 'system@scroobious.com',
    image: 'https://www.giantfreakinrobot.com/wp-content/uploads/2020/09/robocop-returns-feature.jpg',
  })
}
