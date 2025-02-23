import { integer, pgTable } from 'drizzle-orm/pg-core';
import { articles } from '@/db/schema/articles';

export const highlightArticles = pgTable('highlight_articles', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  articleID: integer('article_id')
    .notNull()
    .references(() => articles.id)
});
