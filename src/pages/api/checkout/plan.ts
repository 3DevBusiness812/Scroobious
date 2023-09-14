import { CheckoutRequestCreateInput } from '@binding'
import { callAPI } from '@core/request'

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { stripePlanId } = req.query
    const inputData = {
      stripePlanId: stripePlanId,
      successUrl: `${req.headers.origin}/api/checkout/plan-success`,
      cancelUrl: `${req.headers.origin}/plan`,
    }
    const result = await createCheckout(inputData)
    if (result?.error) {
      throw result.error
    }
    res.redirect(303, result.sessionUrl)
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export async function createCheckout(data: CheckoutRequestCreateInput) {
  return callAPI<any>({
    variables: { data },
    query: `
    mutation ($data: CheckoutRequestCreateInput!) {
      createCheckoutRequest(data: $data) {
          sessionUrl
      }
    }
  `,
    operationName: 'createCheckoutRequest',
  })
}
