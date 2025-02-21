import { articles } from '@db/articles';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const articleContents = pgTable('article_contents', {
  id: integer('id')
    .primaryKey()
    .references(() => articles.id),
  content: text('content').notNull()
});
