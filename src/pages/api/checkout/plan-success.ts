import { CheckoutResponseCreateInput } from '@binding'
import { callAPI } from '@core/request'
import { updateUser } from '@src/auth/update-user.mutation'
import { useSession } from 'next-auth/client'

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const { session_id } = req.query
    const inputData = {
      stripeSessionId: session_id,
    }
    const result = await onPaymentSuccess(inputData)
    if (result?.error) {
      throw result.error
    }
    console.log('result :>> ', result);

    let planBaseURL = ''
    if (result.appliesTo.toLowerCase() === 'founder') {
      planBaseURL = '/founder/success'
    } else if (result.appliesTo.toLowerCase() === 'investor') {
      planBaseURL = '/investor/success'
    } else {
      throw new Error('Could not find appliesTo')
    }
    
    res.redirect(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}${planBaseURL}?payment=success`
    )
  } else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method Not Allowed')
  }
}

export async function onPaymentSuccess(data: CheckoutResponseCreateInput) {
  return callAPI<any>({
    variables: { data },
    query: `
    mutation ($data: CheckoutResponseCreateInput!) {
      createCheckoutResponse(data: $data) {
        stripeCustomerId
        stripeSubscriptionId
        stripeCustomerName
        stripeCustomerEmail
        stripePlanId
        stripePlanName
        appliesTo
      }
    }
  `,
    operationName: 'createCheckoutResponse',
  })
}
