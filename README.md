# Scroobious

## Getting started

First, you need to create `.env.local` files in both the `<root>` folder and `/api` folders with values from LastPass. These are secrets needed to connect to various platforms that should not be checked into version control.

Just run `yarn bootstrap` in the root of the app. This will do the following:

- Generate UI config values
- Generate API config values
- Create DB, migrate schema and add seed data

Then open two terminals and run:

- The API: (go to API folder) `docker-compose up api postgres redis`
- The UI: `yarn dev`

## Troubleshooting

- I'm 99% of the way there, but now I'm unable to access the next-auth.session-token cookie because it's HTTP only.
- Toggling this off makes everything work

## Testing Stripe

### Credit Cards

Stripe has test credit cards listed here: https://stripe.com/docs/testing

### Working with Stripe

- First, you'll need ngrok: `brew install ngrok`
- Next start both the app and api
- Run `ngrok http 3000` to start ngrok

#### Testing Founder Signup

- Edit the [Test Founder Stripe Payment Link](https://dashboard.stripe.com/test/payment-links/plink_1KgjFTF0uyp2jlqjlEdZYv4I/edit) to point to your ngrok link
  - The format of this link should be: `https://74d6-108-20-195-142.ngrok.io/api/checkout/plan-success/?session_id={CHECKOUT_SESSION_ID}`
- Go directly to the payment link screen on Safari:
  https://buy.stripe.com/test_bIYaIpeTa16FbHq6ou

#### Testing Investor Signup

- Edit the [Test Investor Stripe Payment Link](https://dashboard.stripe.com/test/payment-links/plink_1Kl4ByF0uyp2jlqjUhStZktj/edit) to point to your ngrok link
  - The format of this link should be: `https://74d6-108-20-195-142.ngrok.io/api/checkout/plan-success/?session_id={CHECKOUT_SESSION_ID}`
- Go directly to the payment link screen on Safari:
  https://buy.stripe.com/test_dR65o55iAg1zbHq28f

## Component Best Practices

- When creating a component, look to see if we already have one and use that. Don't create multiple copies of components.
- Create components as files named `ComponentName.tsx`, don't create a folder named ComponentName with an index.tsx file. i.e. `/ComponentName/index.tsx`
- We should not use default exports. All should be named exports that are imported like `import { ComponentName } from './ComponentName`
  - Use the `export const CodeListBox = function CodeListBox` syntax in your components to export the component
- The component directory structure is:
  - `/buttons` - all buttons and links (unless they're very specific to a module, then it should go under `modules/...`)
  - `/forms` - all form-related components
  - `/layouts` - generalized higher level layouts - things we expect to share across most screens
  - `/modules` - these are module-specfic components that relate very specifically to items in the pages folder. Ideally we'd just put them in the `pages` folders, but Next.js doesn't allow this
  - `/typeography` - all text and typography components

## Adding our Custom Domain on Render

To add our custom domain, we need to:

1. Go on Render (to the "Web Service") and let it know we're using a custom domain: [scroobious-web](https://dashboard.render.com/web/srv-c4nga3s1nokd81sts3p0)
2. Then go to Google Domains and add the `CNAME` entry [per these instructions on Render's Docs](https://render.com/docs/configure-other-dns#configuring-www-and-other-subdomains)

## Deploying to Production

Deploying to Production just involves merging the `master` branch into the `production` branch. You can do that by running `yarn deploy`.

## Tricks

- If you ever need to sign out, but can't access a link in the UI for some reason, you can navigate directly to [http://localhost:3000/api/auth/signout](http://localhost:3000/api/auth/signout) to log out.
- If jest ever complains that it can't find a file that you've deleted, run `yarn jest --clearCache`

## Best Practices

There are a few (very few) places where there are hints about a best practice for how to do somethings. Search for `BEST_PRACTICE` in the codebase to find some of these.

## Quick Login

There is a "quick login" path that will log you in with some seeded users in DEV and Staging. You can access this page at:

- Development: http://localhost:3000/auth/quick-login
- Staging: https://scroobious-web-staging.onrender.com/auth/quick-login

## Accessing Production to Troubleshoot

We're hosted on [render.com](https://dashboard.render.com) for everything except file uploads (which are on AWS S3). When you merge to master, render automatically deploys to staging [render Staging](https://scroobious-web-staging.onrender.com/). To deploy to Production, you can just put in a PR from master to the production branch. Render stores all environment variables, etc... Be careful in there, though, I don't see a way to back them up or restore. Click into "services" then you can debug deploys on the "events" tab. Or debug the live service in the logs tab (probably just easier to go to Datadog for this though)

## Understanding the Job Service

Summary: I've built a lot of plumbing that makes it easy to carefully add events to Postgres and then have them processed in bullmq aync processors. This keeps the initial user requests fast as no side effects are run in the main thread, it also allows reprocessing if an external service goes down.

The job service is constantly running and can handle both event-based and CRON (timed jobs). All jobs are picked up in the code automatically if they're named with `.job.ts` suffix and have the right signature (copying an existing job is always a good idea). For a CRON job, this is easy, just define a schedule and what you want to happen. For event-based, you'll need a bullmq Job to be created on a particular queue. The queues are automatically created when you create the `.job.ts` file.

Since code can fail anywhere and I want to avoid the case where a users request fails (example - submitting a video), but they get an email or some side effect anyway, I've set up a "transactional outbox" in Postgres (in the `event` table). so you basically add a "create event" step to your Postgres transaction and if the transaction fails, then your event won't be added either. [The "event.poll-and-queue" CRON job](https://github.com/scroobious/app/blob/master/api/src/modules/subscriptions/event/event.poll-and-queue.job.ts) is responsible for grabbing the event records in the DB and firing bullmq jobs. So if you have an event in the event table and a coresponding `job.ts` file that listens to that event, the job code will automatically fire

Further, if your service (example `user.service.ts`) inherits from this `BaseService` , it will automatically create all CRUD events as events in the event table (kind of like an audit trail). Then if you just have the `job.ts` processor listening to one of those events. You'll be wired up automatically and can fire async code. Note that the Cron queuer will ignore any events that don't have an associated job processor.

## Commands for workikng with bindings and migrations

To regenerate bindings from existing schema
`yarn codegen --binding`

To apply migrations
`yarn db:migrate`
`yarn db:seed:run`

