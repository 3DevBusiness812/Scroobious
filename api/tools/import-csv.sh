# Usage: 
# RESOURCE_NAME=company_pitch ./tools/import-csv.sh

export TABLE_NAME=bubble_$RESOURCE_NAME
export SQL_FILE=$RESOURCE_NAME-ddl.sql
export CSV_FILE=/Users/caddy/code/scroobious/app/api/data/$TABLE_NAME.csv

psql $POSTGRES_URL -c "DROP TABLE IF EXISTS $TABLE_NAME" 

# Import the CSV dump into sqllite, then generate a SQL file that has both schema and data from sqllite
sqlite3 $RESOURCE_NAME -cmd '.mode csv '$TABLE_NAME '.import '$CSV_FILE' '$TABLE_NAME '.output ./'$SQL_FILE '.schema'

# Create the table using the DDL generated above
psql $POSTGRES_URL -f $SQL_FILE

# Copy the data in
psql $POSTGRES_URL -c "\COPY $TABLE_NAME FROM '$CSV_FILE' WITH DELIMITER ',' CSV HEADER;"

# Clean up
rm $RESOURCE_NAME && rm $SQL_FILE
