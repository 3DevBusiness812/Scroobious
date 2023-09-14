set -e 

# Codegen for test files
# V3: do the codegen as part of the test suite now
# NODE_ENV=test ./src/test/codegen-test-files.sh

# We need to skip user registration checks so that the tests don't look for Stripe records
export SKIP_USER_REGISTRATION_CHECKS=true
# Use test env vars
WARTHOG_ENV=test yarn dotenv:generate
if [ -z "$SKIP_DB_CREATION" ]
then
  echo 'yarn db:drop'
  yarn db:drop
  echo 'yarn db:create'
  yarn db:create
fi

# Probably a good idea to run DB migrations anyway so that test DB doesn't get behind
echo 'yarn db:migrate'
yarn db:migrate
echo 'yarn db:seed:run'
yarn db:seed:run

# Forward command 1line args to the jest command
echo 'yarn jest --verbose --runInBand $@'
 yarn jest --verbose --runInBand $@
