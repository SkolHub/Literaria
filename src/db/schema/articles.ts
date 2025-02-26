import { articleContents } from '@/db/schema/article-contents';
import { highlightArticles } from '@/db/schema/highlight-articles';
import { relations } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const articles = pgTable(
  'articles',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    createdAt: timestamp('created_at', { mode: 'string', precision: 3 })
      .notNull()
      .defaultNow(),
    title: text('title').notNull(),
    author: text('author').notNull(),
    image: text('image').notNull(),
    path: integer('path').notNull().array(),
    categoryID: integer('category_id'),
    parentID: integer('parent_id'),
    originalID: integer('original_id')
  },
  (table) => [index().on(table.categoryID)]
);

export const articleRelations = relations(articles, ({ one, many }) => ({
  content: one(articleContents, {
    fields: [articles.id],
    references: [articleContents.articleID]
  }),
  children: many(articles, {
    relationName: 'children'
  }),
  parent: one(articles, {
    relationName: 'children',
    fields: [articles.parentID],
    references: [articles.id]
  }),
  recommended: one(highlightArticles, {
    fields: [articles.id],
    references: [highlightArticles.articleID]
  })
}));
