'use server';

import { db } from '@/db/db';
import { articles } from '@/db/schema/articles';
import { galleryImages } from '@/db/schema/gallery-images';
import { highlightArticles } from '@/db/schema/highlight-articles';
import {
  and,
  asc,
  count,
  countDistinct,
  desc,
  eq,
  isNull,
  ne,
  sql
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

type ParentChainRow = {
  id: number;
  title: string;
  title_id: string;
};

export async function getTitleIDByLegacyID(id: number) {
  const result = (
    await db
      .select({
        titleID: articles.titleID
      })
      .from(articles)
      .where(and(eq(articles.originalID, id), eq(articles.deleted, false)))
  )[0];

  if (!result) {
    return null;
  }

  return result.titleID;
}

export async function getArticleByTitleID(title: string) {
  // First get the main article to get the author
  const articleData = await db.query.articles.findFirst({
    where: and(eq(articles.titleID, title), eq(articles.deleted, false)),
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
        where: eq(articles.deleted, false),
        columns: {
          image: true,
          title: true,
          author: true,
          createdAt: true,
          id: true,
          titleID: true
        },
        with: {
          children: {
            where: eq(articles.deleted, false)
          }
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
            where: and(
              ne(articles.titleID, title),
              eq(articles.deleted, false)
            ),
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
    db.execute<ParentChainRow>(sql`
      WITH RECURSIVE article_hierarchy
                       AS (SELECT ${articles.id}, ${articles.parentID}, ${articles.title}, ${articles.titleID}
                           FROM ${articles}
                           WHERE ${articles.titleID} = ${title}
                             AND ${articles.deleted} = false

                           UNION ALL

                           SELECT a.id, a.parent_id, a.title, a.title_id
                           FROM ${articles} a
                                  INNER JOIN article_hierarchy ah ON a.id = ah.parent_id
                           WHERE a.deleted = false)
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
        titleID: articles.titleID,
        author: articles.author,
        createdAt: articles.createdAt,
        image: articles.image
      })
      .from(articles)
      .where(
        and(
          eq(articles.author, articleData.author),
          ne(articles.titleID, title),
          eq(articles.deleted, false)
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
      createdAt: articles.createdAt,
      titleID: articles.titleID
    })
    .from(articles)
    .where(
      sql`
      ${articles.deleted} = false
      AND
      ${articles.id} NOT IN (
        WITH RECURSIVE excluded_articles AS (
          SELECT id
          FROM ${articles}
          WHERE title_id = 'bacalaureat-10'
            AND deleted = false

          UNION ALL

          SELECT child.id
          FROM ${articles} child
          INNER JOIN excluded_articles excluded ON child.parent_id = excluded.id
          WHERE child.deleted = false
        )
        SELECT id FROM excluded_articles
      )
    `
    )
    .orderBy(desc(articles.createdAt))
    .limit(10);
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
    .innerJoin(articles, eq(highlightArticles.articleID, articles.id))
    .where(eq(articles.deleted, false));
}

export async function getCategories() {
  const result = await db.query.articles.findMany({
    where: and(isNull(articles.parentID), eq(articles.deleted, false)),
    columns: {
      title: true,
      id: true,
      titleID: true
    },
    with: {
      children: {
        where: eq(articles.deleted, false),
        orderBy: [asc(articles.createdAt)],
        columns: {
          title: true,
          id: true,
          titleID: true
        },
        with: {
          children: {
            where: eq(articles.deleted, false),
            columns: {
              title: true,
              id: true,
              titleID: true
            },
            with: {
              children: {
                where: eq(articles.deleted, false),
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
      ),
      titleID: child.titleID
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
        AND a.deleted = false

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
             INNER JOIN article_descendants ad ON ad.id = child.parent_id
      WHERE child.deleted = false)
    SELECT id,
           title,
           image,
           author,
           created_at,
           parent_id,
           title_id
    FROM article_descendants
    ORDER BY created_at DESC LIMIT 1;
  `);

  // If we found a result, get the full article data with its relationships
  if (result.rows[0]) {
    const articleId = result.rows[0].id as number;

    return db.query.articles.findFirst({
      where: and(eq(articles.id, articleId), eq(articles.deleted, false)),
      columns: {
        title: true,
        author: true,
        createdAt: true,
        id: true,
        titleID: true,
        image: true
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
    .leftJoin(parent, eq(parent.id, articles.parentID))
    .where(eq(articles.deleted, false));
}

export async function getArticlesStats() {
  const [articlesCount, authorsCount, movieReviewsCount, picturesCount] =
    await Promise.all([
      db
        .select({
          count: count()
        })
        .from(articles)
        .where(eq(articles.deleted, false)),
      db
        .select({
          count: countDistinct(articles.author)
        })
        .from(articles)
        .where(eq(articles.deleted, false)),
      db
        .select({
          count: count()
        })
        .from(articles)
        .where(and(eq(articles.parentID, 9), eq(articles.deleted, false))),
      db
        .select({
          count: count()
        })
        .from(galleryImages)
    ]);

  return {
    articlesCount: articlesCount[0].count,
    authorsCount: authorsCount[0].count,
    movieReviewsCount: movieReviewsCount[0].count,
    picturesCount: picturesCount[0].count
  };
}

export async function getArticleIDs() {
  const result = await db.query.articles.findMany({
    where: eq(articles.deleted, false),
    columns: {
      titleID: true
    }
  });

  return result.map((article) => article.titleID);
}
