import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { articles } from '@/db/schema/articles';

export const articleContents = pgTable('article_contents', {
  articleID: integer('article_id')
    .primaryKey()
    .references(() => articles.id, {
      onDelete: 'cascade'
    }),
  content: text('content').notNull()
});
