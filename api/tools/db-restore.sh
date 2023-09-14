# See: https://simkimsia.com/how-to-restore-database-dumps-for-postgres-in-docker-container/
backup_zip_file=$1
# echo $backup_zip_file

docker-compose up -d postgres
postgres_container=$(docker ps --filter=name=movie-swipe-postgres$ --format "{{.ID}}")

volume_destination=$(docker inspect -f '{{ json .Mounts }}' $postgres_container | jq ".[0].Destination")
# echo $volume_destination

unzip $backup_zip_file backup.sql
docker cp backup.sql $postgres_container:/var/lib/postgresql/data
rm backup.sql

# Drop and re-create DB.  DB restore requires an empty DB
yarn db:drop
yarn db:create

docker exec $postgres_container psql -d movie-swipe -f /var/lib/postgresql/data/backup.sql -v ON_ERROR_STOP=1
docker exec $postgres_container rm /var/lib/postgresql/data/backup.sql
