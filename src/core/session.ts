import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/client'
import { ScroobiousSession } from './types'

export function ensureValidSession(session: ScroobiousSession) {
  // console.log(`ensureValidSession: session`, session)
  if (session && session.user && session.user.id && session.apiToken && session.expires) {
    return true
  }

  throw new Error(`Bad session: ${JSON.stringify(session, undefined, 2)}`)
}

export async function getScroobiousSession(context: GetServerSidePropsContext): Promise<ScroobiousSession> {
  const session = (await getSession(context)) as ScroobiousSession
  ensureValidSession(session)
  return session
}
