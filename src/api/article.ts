'use server';

import { db } from '@/db/db';
import { articles } from '@/db/schema/articles';
import { highlightArticles } from '@/db/schema/highlight-articles';
import { getStorage, listAll, ref } from '@firebase/storage';
import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  isNull,
  ne,
  sql
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { initFirebaseApp } from '../../firebase.config';

export async function getArticleByID(title: string) {
  // First get the main article to get the author
  const articleData = await db.query.articles.findFirst({
    where: eq(articles.titleID, title),
    columns: {
      image: true,
      title: true,
      author: true,
      createdAt: true,
      id: true,
      titleID: true,
      parentID: true
    },
    with: {
      children: {
        columns: {
          image: true,
          title: true,
          author: true,
          createdAt: true,
          id: true,
          titleID: true
        },
        with: {
          children: true
        }
      },
      parent: {
        columns: {
          id: true,
          title: true,
          titleID: true
        },
        with: {
          children: {
            where: ne(articles.titleID, title),
            columns: {
              image: true,
              title: true,
              author: true,
              createdAt: true,
              id: true,
              titleID: true
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
        WITH RECURSIVE article_hierarchy
                           AS (SELECT ${articles.id}, ${articles.parentID}, ${articles.title}, ${articles.titleID}
                               FROM ${articles}
                               WHERE ${articles.titleID} = ${title}

                               UNION ALL

                               SELECT a.id, a.parent_id, a.title, a.title_id
                               FROM ${articles} a
                                        INNER JOIN article_hierarchy ah ON a.id = ah.parent_id)
        SELECT id, title, title_id
        FROM article_hierarchy
        WHERE title_id != ${title}
        ORDER BY id DESC;
    `),

    // Get other articles by the same author
    db
      .select({
        id: articles.id,
        title: articles.title,
        author: articles.author,
        createdAt: articles.createdAt,
        image: articles.image
      })
      .from(articles)
      .where(
        and(
          eq(articles.author, articleData.author),
          ne(articles.titleID, title)
        )
      )
      .orderBy(desc(articles.createdAt))
      .limit(10)
  ]);

  return {
    ...articleData,
    parentChain: parentsQuery.rows,
    siblings: articleData.parent?.children || [],
    authorOtherArticles: authorArticles
  };
}

export async function getLatestArticles() {
  return db
    .select({
      id: articles.id,
      title: articles.title,
      image: articles.image,
      author: articles.author,
      createdAt: articles.createdAt
    })
    .from(articles)
    .limit(10)
    .orderBy(desc(articles.createdAt));
}

export async function getHighlightedArticles() {
  return db
    .select({
      id: articles.id,
      titleID: articles.titleID,
      title: articles.title,
      image: articles.image,
      author: articles.author,
      createdAt: articles.createdAt,
      highlightID: highlightArticles.id
    })
    .from(highlightArticles)
    .innerJoin(articles, eq(highlightArticles.articleID, articles.id));
}

export async function getCategories() {
  const result = await db.query.articles.findMany({
    where: isNull(articles.parentID),
    columns: {
      title: true,
      id: true,
      titleID: true
    },
    with: {
      children: {
        columns: {
          title: true,
          id: true,
          titleID: true
        },
        with: {
          children: {
            columns: {
              title: true,
              id: true,
              titleID: true
            },
            with: {
              children: {
                columns: {
                  title: true,
                  id: true,
                  titleID: true
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
    titleID: parent.titleID,
    children: parent.children.map((child) => ({
      id: child.id,
      title: child.title,
      children: child.children.filter(
        (grandChild) => grandChild.children.length
      )
    }))
  }));
}

export async function getLatestArticleWithAncestor(ancestorIds: number[]) {
  if (!ancestorIds.length) {
    return null;
  }

  // Convert the array into a comma-separated string of numbers
  const ancestorIdsString = ancestorIds.join(',');

  // Using a recursive CTE to find all descendants of the specified ancestors
  const result = await db.execute(sql`
      WITH RECURSIVE article_descendants AS (
          -- Base case: start with all articles that have the specified ancestors as parents
          SELECT a.id,
                 a.title,
                 a.image,
                 a.author,
                 a.created_at,
                 a.parent_id,
                 a.title_id
          FROM articles a
          WHERE a.parent_id IN (SELECT unnest(string_to_array(${ancestorIdsString}, ',')::integer[]))

          UNION ALL

          -- Recursive case: join with child articles
          SELECT child.id,
                 child.title,
                 child.image,
                 child.author,
                 child.created_at,
                 child.parent_id,
                 child.title_id
          FROM articles child
                   INNER JOIN article_descendants ad ON ad.id = child.parent_id)
      SELECT id,
             title,
             image,
             author,
             created_at,
             parent_id,
             title_id
      FROM article_descendants
      ORDER BY created_at DESC
      LIMIT 1;
  `);

  // If we found a result, get the full article data with its relationships
  if (result.rows[0]) {
    const articleId = result.rows[0].id as number;

    return db.query.articles.findFirst({
      where: eq(articles.id, articleId),
      columns: {
        title: true,
        author: true,
        createdAt: true,
        id: true,
        titleID: true
      }
    });
  }

  return null;
}

export async function getArticleNames() {
  const parent = alias(articles, 'parent');

  return db
    .select({
      title: articles.title,
      id: articles.id,
      titleID: articles.titleID,
      createdAt: articles.createdAt,
      parentTitle: parent.title
    })
    .from(articles)
    .leftJoin(parent, eq(parent.id, articles.parentID));
}

export async function getArticlesStats() {
  const storage = getStorage(initFirebaseApp());
  const imagesRef = ref(storage, 'gallery');

  const picturesCount = await listAll(imagesRef)
    .then((res) => {
      return res.items.length || 0;
    })
    .catch((error) => {
      console.error('Error listing files', error);
    });

  const [articlesCount, authorsCount, movieReviewsCount] = await Promise.all([
    db
      .select({
        count: count()
      })
      .from(articles),
    db
      .select({
        count: countDistinct(articles.author)
      })
      .from(articles),
    db
      .select({
        count: count()
      })
      .from(articles)
      .where(eq(articles.parentID, 9))
  ]);

  return {
    articlesCount: articlesCount[0].count,
    authorsCount: authorsCount[0].count,
    movieReviewsCount: movieReviewsCount[0].count,
    picturesCount
  };
}

export async function getArticleIDs() {
  const result = await db.query.articles.findMany({
    columns: {
      id: true
    },
    with: {
      children: {
        columns: {
          id: true
        }
      }
    }
  });

  return result.map((article) => article.id);
}
