source ../.env
scp ../db-api/postgrest.conf "$DB_API_USER@$DB_API_SERVER:~/postgrest.conf"
scp ../.env "$DB_API_USER@$DB_API_SERVER:~/.env"
