// Proxy all calls to /graphql to our custom GraphQL server
// This way, all client requests come to the Next.js server directly
import { getApiTokenFromRequest } from '@core/cookie'
import { createProxyMiddleware } from 'http-proxy-middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

const proxy = createProxyMiddleware({
  target: `${process.env.WARTHOG_API_BASE_URL}/graphql`,
  changeOrigin: true, // for vhosted sites
  logLevel: 'silent',
  onError: function onError(err, req, res, target) {
    // console.log('(graphql) onError')
    const errorCode = (err as any).code
    let errorMessage

    if (errorCode === 'ECONNRESET') {
      errorMessage = "The server is down and we're working on it!"
    }
    // console.log('err :>> ', err)
    // console.log('err.name :>> ', err.name)
    // console.log('err.stack :>> ', err.stack)
    // console.log('(err as any).code :>> ')

    res.writeHead(500, {
      'Content-Type': 'application/json',
    })
    res.end(JSON.stringify({ errors: errorMessage }))
  },
})

export default async function graphql(req: NextApiRequest, res: NextApiResponse) {
  const apiToken = getApiTokenFromRequest(req)
  // console.log(`apiToken`, apiToken)

  // TODO: what do we do if we can't find an API token?  Redirect?
  if (apiToken) {
    // TODO: what do we do if the authorization header is already set?
    req.headers.authorization = `Bearer ${apiToken}`
  }
  // DEBUG_AUTH: console.log(`apiToken`, apiToken)

  return (proxy as any)(req, res)
}
