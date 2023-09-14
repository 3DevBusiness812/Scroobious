# Source the .env.local file so that it can be used by dotenvi
# Otherwise, config:generate yells that it can't find environment variables
# that we've specified in .env.local
unamestr=$(uname)
if [ "$unamestr" = 'Linux' ]; then
  export $(grep -v '^#' .env.local | xargs -d '\n')
elif [ "$unamestr" = 'FreeBSD' ]; then
  export $(grep -v '^#' .env.local | xargs -0)
elif [ "$unamestr" = 'Darwin' ]; then
  if [ -f ".env.local" ]; then
    set -o allexport
    source .env.local
    set +o allexport
  fi 
fi

yarn dotenvi -s ${WARTHOG_ENV:-development}