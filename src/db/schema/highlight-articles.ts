import { articles } from '@db/articles';
import { integer, pgTable } from 'drizzle-orm/pg-core';

export const highlightArticles = pgTable('highlight_articles', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  articleID: integer('article_id')
    .notNull()
    .references(() => articles.id)
});
