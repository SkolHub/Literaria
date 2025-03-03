import { article, recommendedArticle } from '../../../drizzle/schema';
import { count, countDistinct, desc, eq, isNull, sql } from 'drizzle-orm';
import { db } from '@/lib/api/drizzle';
import { alias } from 'drizzle-orm/pg-core';

const getArticleId = (id: number) => {
  return db.query.article.findFirst({
    where: eq(article.id, id),
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
};

const getLatest = () => {
  return db.select().from(article).limit(10).orderBy(desc(article.createdAt));
};

const getRecommended = () => {
  return db
    .select()
    .from(recommendedArticle)
    .innerJoin(article, eq(recommendedArticle.articleId, article.id));
};

const getCategories = async () => {
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
};

const getArticleNames = async () => {
  const parent = alias(article, 'parent');

  return db
    .select({
      title: article.title,
      id: article.id,
      parentTitle: parent.title
    })
    .from(article)
    .leftJoin(parent, eq(parent.id, article.parentId));
};

const getArticleCount = async () => {
  return (
    await db
      .select({
        articles: count(article.id),
        authors: countDistinct(article.author),
        reviews: sql`COUNT(CASE WHEN "parentID" = 9 THEN 1 END)`
      })
      .from(article)
  )[0];
};

export {
  getArticleId,
  getRecommended,
  getLatest,
  getCategories,
  getArticleCount,
  getArticleNames
};
