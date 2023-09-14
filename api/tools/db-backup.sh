base_filename=tmdb_db_backup
timestamp=`date +%Y-%m-%d_%H-%M-%S`
zip_file=$base_filename$timestamp.zip
# echo $zip_file

docker-compose up -d postgres
postgres_container=$(docker ps --filter=name=postgres --format "{{.ID}}")
# echo $postgres_container

docker exec $postgres_container pg_dump movie-swipe > backup.sql
zip $zip_file backup.sql
mv $zip_file ~/Dropbox/tmdb
rm backup.sql