# Database Setup & PostgreSQL Conversion

By default, the template comes pre-configured with **SQLite** for zero-configuration, immediate local development. The database is stored in `backend/dev.db`.

This document explains how the database is structured and how to swap drivers to **PostgreSQL** (either hosted locally, via Docker, or in the cloud) when you are ready.

---

## 1. Drizzle ORM Setup

Drizzle ORM is a lightweight TypeScript SQL tool. We use Drizzle schemas in `backend/src/db/schema.ts` to define the database tables.

The database client is initialized in `backend/src/db/index.ts`. It looks at your `.env` configuration:
* `DATABASE_URL`: Connection string.
* `DB_TYPE`: Either `sqlite` or `postgres`.

---

## 2. Running PostgreSQL via Docker (Recommended)

To run a local PostgreSQL instance easily, we include a `docker-compose.yml` file in the root.

### Step 1: Start PostgreSQL Container
In the root directory, run:
```bash
docker compose up -d
```
This launches a Postgres server on port `5432` with:
* **Database Name**: `vibe_db`
* **Username**: `postgres`
* **Password**: `postgres`

### Step 2: Update environment variables
Open your `backend/.env` file and modify the database configurations:
```ini
DB_TYPE=postgres
DATABASE_URL=postgres://postgres:postgres@localhost:5432/vibe_db
```

---

## 3. Shifting Drivers programmatically

The database client in `backend/src/db/index.ts` supports both drivers. The CLI wizard configures this for you, but if you do it manually:

### To run SQLite (Default):
Drizzle uses `bun:sqlite` natively when running under Bun:
```typescript
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = new Database("dev.db");
export const db = drizzle(sqlite);
```

### To run PostgreSQL:
We use the `postgres` NPM module (supported natively under Bun):
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient);
```

---

## 4. Database Migrations

Drizzle manages database changes using migrations. Depending on the `DB_TYPE` you are running, use the dialect-specific npm commands:

### For SQLite (Default):
1. **Generate Migrations**:
   ```bash
   bun run db:generate
   ```
2. **Apply / Push Schemas**:
   ```bash
   bun run db:push
   ```
*(Note: Requires the development dependency `better-sqlite3` installed to allow Drizzle-Kit to interface with SQLite. This package is pre-configured in `package.json`).*

### For PostgreSQL:
1. **Generate Migrations**:
   ```bash
   bun run db:generate:pg
   ```
2. **Apply / Push Schemas**:
   ```bash
   bun run db:push:pg
   ```
