'use server';

import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { articles } from '@/db/schema/articles';
import { articleContents } from '@/db/schema/article-contents';

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
  const id = (
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
  )[0].id;

  await db.insert(articleContents).values({
    articleID: id,
    content: props.content
  });

  return id;

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
  await db
    .update(articles)
    .set({
      title: props.title,
      image: props.image,
      author: props.author,
      parentID: props.parentID
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
