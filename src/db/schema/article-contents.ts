import { articles } from '@db/articles';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const articleContents = pgTable('article_contents', {
  articleID: integer('article_id')
    .primaryKey()
    .references(() => articles.id, {
      onDelete: 'cascade'
    }),
  content: text('content').notNull()
});
