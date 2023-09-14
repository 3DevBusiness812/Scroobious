import { CalendlyWebhookEventCreateInput } from '@binding'
import { callAPI } from '@core/request'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  const event: any = req.body

  console.log('event :>> ', event)

  const result = await createCalendlyWebhookEvent({
    type: event.event,
    raw: event as any,
  })

  console.log('result :>> ', result)

  res.json({ received: true })
}

export async function createCalendlyWebhookEvent(data: CalendlyWebhookEventCreateInput) {
  return callAPI<any>({
    variables: { data },
    query: `
    mutation ($data: CalendlyWebhookEventCreateInput!) {
      createCalendlyWebhookEvent(data: $data) {
        id
      }
    }
  `,
    operationName: 'createCalendlyWebhookEvent',
  })
}
