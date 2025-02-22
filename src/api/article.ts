'use server';

import { db } from '@/db/db';
import { article, recommendedArticle } from '@db/articles';
import { and, desc, eq, isNull, ne, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export async function getArticleByID(id: number) {
  // First get the main article to get the author
  const articleData = await db.query.article.findFirst({
    where: eq(article.id, id),
    columns: {
      image: true,
      title: true,
      author: true,
      createdAt: true,
      id: true,
      parentId: true
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
      parent: {
        columns: {
          id: true,
          title: true
        },
        with: {
          children: {
            where: ne(article.id, id),
            columns: {
              image: true,
              title: true,
              author: true,
              createdAt: true,
              id: true
            }
          }
        }
      },
      content: true
    }
  });

  if (!articleData) {
    return null;
  }

  // Then get the remaining data using the author we retrieved
  const [parentsQuery, authorArticles] = await Promise.all([
    // Get all parent IDs using a recursive CTE
    db.execute(sql`
      WITH RECURSIVE article_hierarchy AS (
        SELECT id, "parentID", title
        FROM "Article"
        WHERE id = ${id}
        
        UNION ALL
        
        SELECT a.id, a."parentID", a.title
        FROM "Article" a
        INNER JOIN article_hierarchy ah ON a.id = ah."parentID"
      )
      SELECT id, title
      FROM article_hierarchy
      WHERE id != ${id}
      ORDER BY id DESC;
    `),

    // Get other articles by the same author
    db.query.article.findMany({
      where: and(
        eq(article.author, articleData.author),
        ne(article.id, id)
      ),
      columns: {
        id: true,
        title: true,
        author: true,
        createdAt: true,
        image: true
      },
      orderBy: [desc(article.createdAt)],
      limit: 10
    })
  ]);

  return {
    ...articleData,
    parentChain: parentsQuery.rows,
    siblings: articleData.parent?.children || [],
    authorOtherArticles: authorArticles
  };
}

export async function getLatestArticles() {
  return db.select().from(article).limit(10).orderBy(desc(article.createdAt));
}

export async function getHighlightedArticles() {
  return db
    .select()
    .from(recommendedArticle)
    .innerJoin(article, eq(recommendedArticle.articleId, article.id));
}

export async function getCategories() {
  const result = await db.query.article.findMany({
    where: isNull(article.parentId),
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
  const parent = alias(article, 'parent');

  return db
    .select({
      title: article.title,
      id: article.id,
      parentTitle: parent.title
    })
    .from(article)
    .leftJoin(parent, eq(parent.id, article.parentId));
}

export async function getArticlesStats() {
  const parent = alias(article, 'parent');

  return db
    .select({
      title: article.title,
      id: article.id,
      parentTitle: parent.title
    })
    .from(article)
    .leftJoin(parent, eq(parent.id, article.parentId));
}
