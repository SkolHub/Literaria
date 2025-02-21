import { articleContents } from '@db/article-contents';
import { highlightArticles } from '@db/highlight-articles';
import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const articles = pgTable('articles', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  image: text('image').notNull(),
  parentID: integer('parent_id'),
  originalID: integer('original_id')
});

export const articleRelations = relations(articles, ({ one, many }) => ({
  content: one(articleContents, {
    fields: [articles.id],
    references: [articleContents.id]
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
