source ../.env.prod
scp ../db-api/postgrest.conf "$DB_API_USER@$DB_API_SERVER:~/postgrest.conf"
scp ../.env.prod "$DB_API_USER@$DB_API_SERVER:~/.env"
