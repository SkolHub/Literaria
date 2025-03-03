import {
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  timestamp
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { config } from 'dotenv';

config();

export const user = pgTable('User', {
  id: serial('id').primaryKey(),
  user: text('user').notNull().unique(),
  password: text('password').notNull()
});

export const article = pgTable(
  'Article',
  {
    id: serial('id').primaryKey(),
    createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    title: text('title').notNull(),
    author: text('author').notNull(),
    image: text('image').notNull(),
    parentId: integer('parentID')
  },
  (table) => {
    return {
      foreign: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
        name: 'foreign'
      })
        .onUpdate('cascade')
        .onDelete('set null')
    };
  }
);

export const articleRelations = relations(article, ({ one, many }) => ({
  content: one(articleContent, {
    fields: [article.id],
    references: [articleContent.articleId]
  }),
  children: many(article, {
    relationName: 'children'
  }),
  parent: one(article, {
    relationName: 'children',
    fields: [article.parentId],
    references: [article.id]
  }),
  recommended: one(recommendedArticle, {
    fields: [article.id],
    references: [recommendedArticle.id]
  })
}));

export const articleContent = pgTable('ArticleContent', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  articleId: integer('articleID')
    .notNull()
    .references(() => article.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade'
    })
});

export const recommendedArticle = pgTable('RecommendedArticle', {
  id: serial('id').primaryKey(),
  articleId: integer('articleID')
    .notNull()
    .references(() => article.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade'
    })
});
