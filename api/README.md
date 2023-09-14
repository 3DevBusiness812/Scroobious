# Scroobious API

## Getting Started

First, you need to create `.env.local` files in both the `<root>` folder and `/api` folders with values from LastPass. These are secrets needed to connect to various platforms that should not be checked into version control.

Run `yarn bootstrap` to build the app and populate the database.

Run `docker-compose up api postgres redis` to spin up the API.

## Development

### Build an API Endpoint

- Use Insomnia to create the right query or mutation
- Modify the models and services until things are working properly
- Grab this query and put it in Next.js code

### Run GraphQL Playground

Navigate to [http://localhost:5001/graphql](http://localhost:5001/graphql) and you'll have access to GraphQL playground.

### Build a new Job (todo)

```bash
WARTHOG_JOBS_PATH=src/modules/pitches/**/*.job.ts
```

Note: when working on a single job set `WARTHOG_JOBS_PATH` in .env.local to cut out the noise:

## Add or modify models (which leads to DB changes)

Assumes you have the `api` Docker service up and running. Run the command directly on the running docker instance.

- Make the necessary changes in the \*.model.ts file
- Run `docker-compose run api yarn db:migrate:generate <description for migration file>`
- Run `docker-compose run api yarn db:migrate`

## Testing

There are very few tests right now, but the harness is in place. To run tests, run `yarn test`.

This will create a test DB and then run the tests. On subsequent test runs, you can run the following so that they'll run faster (by not re-creating the DB):

```bash
SKIP_DB_CREATION=true yarn test
```

You can also run a single test by running:

```bash
SKIP_DB_CREATION=true yarn test ./src/modules/pitch/pitch.test.ts --watch
```

## Transactions

See [pitch-written-feedback.resolver.ts](./src/modules/pitches/pitch-written-feedback/pitch-written-feedback.resolver.ts) for an example of how to do a full API transaction

## Stripe in DEV

If you want to bypass needing to register in Stripe in DEV, fire up the app with `SKIP_USER_REGISTRATION_CHECKS=true yarn start:api:dev`. This will just bypass the check and allow you to register founders.

## How To

### Get a deep link URL into an email

See:

- [password reset job](https://github.com/scroobious/app/blob/master/api/src/modules/identity/password-reset/password-reset.job.ts#L19)
- [password reset service](https://github.com/scroobious/app/blob/master/api/src/modules/identity/password-reset/password-reset.service.ts#L20-L22)

### How to send an email with extra metadata

See the pitch [publish job](https://github.com/scroobious/app/blob/master/api/src/modules/pitches/pitch/pitch.publish.job.ts#L38). Just pass a hash to notifier.trackUser.

## Run App using the Job Processor

You need to bootstrap the backend and run the frontend, additionally you have to open a 3rd terminal to activate the redis container.

If you want redis to run behind the scenes you can write in the terminal `docker-compose up -d redis`, otherwise run `docker-compose up redis` and it will keep the instance live in your terminal.

To have the jobs processor running: Open a new terminal inside the api directory and run `yarn start:jobs:dev`.
