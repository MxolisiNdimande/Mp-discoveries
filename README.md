# gateway-discoveries
Mpumalanga province tourist destinations

## Database (Postgres) setup

This project includes SQL for Postgres under `database/init/01-init.sql`. To enable database-backed endpoints and persistent data:

- Start a Postgres instance (Docker example):

```powershell
docker run --name gateway-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=gateway -p 5432:5432 -d postgres:15
docker exec -i gateway-pg psql -U postgres -d gateway -f /path/to/database/init/01-init.sql
```

- Or run the SQL file using `psql` against your DB. Set env vars for the server to use the DB (either `DATABASE_URL` or `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`).

- When Postgres is configured the server will report `Database: connected` on start and `/api/health` will include `database: connected`.

If Postgres is not configured the server will continue to run using in-memory demo data.
