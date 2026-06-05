# Database Usage & Guidelines

This template uses **Drizzle ORM** for database interactions, defaulting to a local SQLite file (`dev.db`) running on the native `bun:sqlite` driver. It also fully supports PostgreSQL via the `postgres` NPM module.

## Core Principles

1. **Schemas Location**: All database schemas must be defined in `backend/src/db/schema.ts`.
2. **Initialization**: The database client is exported from `backend/src/db/index.ts`. Import `db` from this file to execute queries.

## Managing Migrations

When you change the schema in `backend/src/db/schema.ts`, you must push the changes to the database. 

Depending on the `DB_TYPE` defined in `backend/.env` (either `sqlite` or `postgres`), run the corresponding NPM script:

### SQLite (Default)
Changes sync automatically on backend startup using pre-compiled SQL in `backend/drizzle/`, but you can manually generate migrations using:
```bash
bun run db:generate
bun run db:push
```

### PostgreSQL
```bash
bun run db:generate:pg
bun run db:push:pg
```

## Drizzle ORM Best Practices
- **Use TypeScript**: Drizzle is fully type-safe. Rely on its inferred types when passing data to/from the database.
- **Environment Variables**: Never hardcode connection strings. Rely on `DATABASE_URL` and `DB_TYPE` in the `.env` file.
- **Relational Queries**: Use Drizzle's relational query API (`db.query.tableName.findMany()`) for complex joins when possible, as it is often cleaner than manual `.leftJoin()` calls.
