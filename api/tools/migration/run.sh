# Set Postgres URL if it is not set
# Allows us to pass it in for migrations not on DEV machines

# POSTGRES_URL is blank when we're on our DEV machine
if [ "$POSTGRES_URL" = "" ]; then
  export POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/scroobious

  # ONLY DO THE FOLLOWING LOCALLY

  # Ensure no connections to DB
  docker-compose down
  docker-compose up -d postgres

  # Generate .env
  yarn dotenv:generate

  # Recreate DB
  yarn db:drop
  yarn db:create

  yarn db:migrate
  SKIP_USER_REGISTRATION_CHECKS=true yarn db:seed:run
fi

# Pull Bubble data into temp tables
./tools/migration/import_bubble_data.sh

# Run migration to pull Bubble data into live tables
psql $POSTGRES_URL -f ./tools/migration/bubble_migration.psql
