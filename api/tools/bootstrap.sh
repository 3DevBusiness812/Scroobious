# Make sure we don't have any temporary migrations in the db/migrations folder
# These are created below in the bootstrap script.  This helps streamline the 
# flow when you're testing out the full bootstrap script
git clean -f ./db/migrations/ActiveDevelopment* 

yarn build:dev

# Make sure postgres is running
docker-compose up -d postgres

# Create a fresh DB with all committed migrations
yarn db:drop
yarn db:create
yarn db:migrate

# If your DEV environment has changes to models that would cause additional DB
# schema updates, we'll create a temporary migration and run it so that the 
# DB is at the very latest
yarn db:migrate:generate active-development
yarn db:migrate

# Seed the DB with data. You need to skip registration checks as otherwise we'd need folks to have registered in Stripe
SKIP_USER_REGISTRATION_CHECKS=true yarn db:seed:run

# Until the docker setup gets faster, we'll use `yarn start:api:dev` to run the API
# yarn switch:docker

# # Start the API
# docker-compose up api

yarn start:api:dev