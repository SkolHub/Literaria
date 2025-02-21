'use server';

import { db } from '@/db/db';
import { articles, highlightArticles } from '@db/articles';
import { count, countDistinct, desc, eq, isNull, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export async function getArticleByID(id: number) {
  return db.query.articles.findFirst({
    where: eq(articles.id, id),
    columns: {
      image: true,
      title: true,
      author: true,
      createdAt: true,
      id: true
    },
    with: {
      children: {
        columns: {
          image: true,
          title: true,
          author: true,
          createdAt: true,
          id: true
        },
        with: {
          children: true
        }
      },
      parent: true,
      content: true
    }
  });
}

export async function getLatestArticles() {
  return db.select().from(articles).limit(10).orderBy(desc(articles.createdAt));
}

export async function getHighlightedArticles() {
  return db
    .select({
      image: articles.image,
      title: articles.title,
      author: articles.author,
      createdAt: articles.createdAt,
      id: articles.id
    })
    .from(highlightArticles)
    .innerJoin(articles, eq(highlightArticles.articleID, articles.id));
}

export async function getCategories() {
  const result = await db.query.articles.findMany({
    where: isNull(articles.parentID),
    columns: {
      title: true,
      id: true
    },
    with: {
      children: {
        columns: {
          title: true,
          id: true
        },
        with: {
          children: {
            columns: {
              title: true,
              id: true
            },
            with: {
              children: {
                columns: {
                  title: true,
                  id: true
                }
              }
            }
          }
        }
      }
    }
  });

  return result.map((parent) => ({
    id: parent.id,
    title: parent.title,
    children: parent.children.map((child) => ({
      id: child.id,
      title: child.title,
      children: child.children.filter(
        (grandChild) => grandChild.children.length
      )
    }))
  }));
}

export async function getArticleNames() {
  const parent = alias(articles, 'parent');

  return db
    .select({
      title: articles.title,
      id: articles.id,
      parentTitle: parent.title
    })
    .from(articles)
    .leftJoin(parent, eq(parent.id, articles.parentID));
}

export async function getArticlesStats() {
  return (
    await db
      .select({
        articles: count(articles.id),
        authors: countDistinct(articles.author),
        reviews: sql`COUNT(CASE WHEN "parentID" = 9 THEN 1 END)`
      })
      .from(articles)
  )[0];
}
