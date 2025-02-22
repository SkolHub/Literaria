'use server';

import { db } from '@/db/db';
import { articles } from '@/db/schema/articles';
import { articleContents } from '@db/*';
import { eq } from 'drizzle-orm';

export async function getAllSidebarArticles() {
  return db
    .select({
      id: articles.id,
      parentID: articles.parentID,
      title: articles.title,
      author: articles.author
    })
    .from(articles);
}

export interface CreateArticleDto {
  title: string;
  content: string;
  image: string;
  author: string;
  parentID: number | null;
}

export async function createArticle(props: CreateArticleDto) {
  const article = (
    await db
      .insert(articles)
      .values({
        title: props.title,
        image: props.image,
        author: props.author,
        parentID: props.parentID
      })
      .returning({
        id: articles.id
      })
  )[0];

  await db.insert(articleContents).values({
    articleID: article.id,
    content: props.content
  });

  return article.id;
}

export async function updateArticle(
  id: number,
  props: Partial<CreateArticleDto>
) {
  if (
    props.author ||
    props.title ||
    props.image ||
    typeof props.parentID !== 'undefined'
  ) {
    await db
      .update(articles)
      .set({
        title: props.title,
        image: props.image,
        author: props.author,
        parentID: props.parentID
      })
      .where(eq(articles.id, id));
  }

  if (props.content) {
    await db
      .update(articleContents)
      .set({
        content: props.content
      })
      .where(eq(articleContents.articleID, id));
  }
}
