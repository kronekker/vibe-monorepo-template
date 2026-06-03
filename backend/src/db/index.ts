import { drizzle as drizzleSqlite } from 'drizzle-orm/bun-sqlite';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import { Database } from 'bun:sqlite';
import postgres from 'postgres';
import * as schema from './schema';

const dbType = process.env.DB_TYPE || 'sqlite';
const dbUrl = process.env.DATABASE_URL || 'dev.db';

export let db: any;

if (dbType === 'sqlite') {
  const sqlite = new Database(dbUrl);
  db = drizzleSqlite(sqlite, { schema });
  
  // Pragmas for performance and WAL mode
  sqlite.run('PRAGMA journal_mode = WAL;');
  sqlite.run('PRAGMA synchronous = NORMAL;');
} else {
  const queryClient = postgres(dbUrl);
  db = drizzlePostgres(queryClient, { schema });
}
