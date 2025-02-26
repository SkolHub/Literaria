import { config } from 'dotenv';
import {
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  timestamp
} from 'drizzle-orm/pg-core';

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
