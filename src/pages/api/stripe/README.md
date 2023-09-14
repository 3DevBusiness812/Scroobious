# Stripe Webhooks

## Local DEV

- First, install the Stripe CLI: `brew install stripe/stripe-cli/stripe`
- `stripe login`
- `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- `stripe trigger payment_intent.succeeded`
