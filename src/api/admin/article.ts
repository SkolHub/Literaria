'use server';

import { isAdmin } from '@/api/admin/auth';
import { db } from '@/db/db';
import { articleContents } from '@/db/schema/article-contents';
import { articles } from '@/db/schema/articles';
import { toKebabCase } from '@/lib/utils/kebab-case';
import { highlightArticles } from '@db/*';
import { eq } from 'drizzle-orm';

export async function getAllSidebarArticles() {
  await isAdmin();

  return db
    .select({
      id: articles.id,
      parentID: articles.parentID,
      title: articles.title,
      author: articles.author,
      titleID: articles.titleID
    })
    .from(articles);
}

export async function getAllArticlesHighlights() {
  await isAdmin();

  return db
    .select({
      id: articles.id,
      title: articles.title,
      author: articles.author,
      image: articles.image,
      createdAt: articles.createdAt
    })
    .from(articles);
}

export async function updateHighlightedArticles(ids: [number, number, number]) {
  await isAdmin();

  await Promise.all(
    ids.map((id, index) =>
      db
        .update(highlightArticles)
        .set({
          articleID: id
        })
        .where(eq(highlightArticles.id, index + 1))
    )
  );
}

export interface CreateArticleDto {
  title: string;
  content: string;
  image: string;
  author: string;
  parentID: number | null;
}

export async function createArticle(props: CreateArticleDto) {
  await isAdmin();

  const id = (
    await db
      .insert(articles)
      .values({
        title: props.title,
        image: props.image,
        author: props.author,
        parentID: props.parentID,
        titleID: toKebabCase(props.title)
      })
      .returning({
        id: articles.id,
        titleID: articles.titleID
      })
  )[0];

  await db.insert(articleContents).values({
    articleID: id.id,
    content: props.content
  });

  return id.titleID;

  // let article;
  //
  // if (props.parentID) {
  //   const parentArticle = db.$with('parent').as(
  //     db
  //       .select({
  //         path: articles.path,
  //         id: articles.id,
  //         categoryID: articles.categoryID
  //       })
  //       .from(articles)
  //       .where(eq(articles.id, props.parentID))
  //   );
  //
  //   article = (
  //     await db
  //       .with(parentArticle)
  //       .insert(articles)
  //       .values({
  //         title: props.title,
  //         image: props.image,
  //         author: props.author,
  //         parentID: props.parentID,
  //         categoryID: sql`${parentArticle.categoryID}`,
  //         path: sql`${parentArticle.path}
  //         ||
  //         ${parentArticle.id}`
  //       })
  //       .returning({
  //         id: articles.id
  //       })
  //   )[0];
  // } else {
  //   article = (
  //     await db
  //       .insert(articles)
  //       .values({
  //         title: props.title,
  //         image: props.image,
  //         author: props.author,
  //         parentID: props.parentID
  //       })
  //       .returning({
  //         id: articles.id
  //       })
  //   )[0];
  // }
  //
  // await db.insert(articleContents).values({
  //   articleID: article.id,
  //   content: props.content
  // });
  //
  // return article.id;
}

export async function updateArticle(
  id: number,
  props: Partial<CreateArticleDto>
) {
  await isAdmin();

  await db
    .update(articles)
    .set({
      title: props.title,
      image: props.image,
      author: props.author,
      parentID: props.parentID,
      titleID: props.title ? toKebabCase(props.title) : undefined
    })
    .where(eq(articles.id, id));

  await db
    .update(articleContents)
    .set({
      content: props.content
    })
    .where(eq(articleContents.articleID, id));

  // if (
  //   props.author ||
  //   props.title ||
  //   props.image ||
  //   typeof props.parentID !== 'undefined'
  // ) {
  //   await db
  //     .update(articles)
  //     .set({
  //       title: props.title,
  //       image: props.image,
  //       author: props.author,
  //       parentID: props.parentID
  //     })
  //     .where(eq(articles.id, id));
  // }
  //
  // if (props.content) {
  //   await db
  //     .update(articleContents)
  //     .set({
  //       content: props.content
  //     })
  //     .where(eq(articleContents.articleID, id));
  // }
  //
  // if (typeof props.parentID !== 'undefined') {
  //   const newParent = db.$with('new_parent').as(
  //     db
  //       .select({
  //         path: articles.path,
  //         id: articles.id,
  //         categoryID: articles.categoryID
  //       })
  //       .from(articles)
  //       .where(eq(articles.id, props.parentID ?? -1))
  //   );
  //
  //   const movedArticle = db.$with('new_parent').as(
  //     db
  //       .select({
  //         path: articles.path,
  //         id: articles.id,
  //         categoryID: articles.categoryID
  //       })
  //       .from(articles)
  //       .where(eq(articles.id, id))
  //   );
  //
  //   await db.update(articles).set({
  //     path: sql`new_parent
  //     .
  //     path
  //     || subpath(a.path, array_length(moved_article.path, 1))`
  //   }).where(sql`${id}
  //   = ANY(
  //   ${articles.path}
  //   )`);
  // }
}
