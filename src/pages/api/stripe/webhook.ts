import { StripeWebhookEventCreateInput } from '@binding'
import { callAPI } from '@core/request'
import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: null,
// })

// // If you are testing your webhook locally with the Stripe CLI you
// // can find the endpoint's secret by running `stripe listen`
// // Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }
  const event: Stripe.Event = req.body
  console.log('event :>> ', event)

  // TODO: verify that the request is coming from Stripe
  // verification is currently broken
  //
  // const sig = req.headers['stripe-signature']
  // try {
  //   event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  //   // return console.log('event :>> ', event)
  // } catch (err) {
  //   // return console.log('err :>> ', err)
  //   res.status(400).send(`Webhook Error: ${(err as Error).message}`)
  // }

  const result = await createStripeWebhookEvent({
    type: event.type,
    raw: event as any,
  })

  console.log('result :>> ', result)

  res.json({ received: true })
}

export async function createStripeWebhookEvent(data: StripeWebhookEventCreateInput) {
  return callAPI<any>({
    variables: { data },
    query: `
    mutation ($data: StripeWebhookEventCreateInput!) {
      createStripeWebhookEvent(data: $data) {
        id
      }
    }
  `,
    operationName: 'createStripeWebhookEvent',
  })
}
