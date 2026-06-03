import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Default SQLite Table Definition
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

/*
========================================================================
POSTGRESQL CONVERSION REFERENCE
========================================================================
If you switch DB_TYPE to 'postgres' in your .env file, replace the imports
and definitions above with the following PostgreSQL equivalent:

import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
========================================================================
*/
