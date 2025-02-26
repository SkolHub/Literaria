import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const drafts = pgTable('drafts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  image: text('image').notNull(),
  parentID: integer('parent_id')
});
