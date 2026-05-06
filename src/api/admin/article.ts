'use server';

import { isAdmin } from '@/api/admin/auth';
import { db } from '@/db/db';
import { articleContents } from '@/db/schema/article-contents';
import { articles } from '@/db/schema/articles';
import { toKebabCase } from '@/lib/utils/kebab-case';
import { highlightArticles } from '@db/*';
import { and, eq, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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
    .from(articles)
    .where(eq(articles.deleted, false));
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
    .from(articles)
    .where(eq(articles.deleted, false));
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

async function getParentTitleID(parentID: number | null) {
  if (parentID === null) {
    return null;
  }

  const parentArticle = await db.query.articles.findFirst({
    where: and(eq(articles.id, parentID), eq(articles.deleted, false)),
    columns: {
      titleID: true
    }
  });

  return parentArticle?.titleID ?? null;
}

async function titleIDExists(titleID: string, excludedArticleID?: number) {
  const article = await db.query.articles.findFirst({
    where:
      typeof excludedArticleID === 'number'
        ? and(eq(articles.titleID, titleID), ne(articles.id, excludedArticleID))
        : eq(articles.titleID, titleID),
    columns: {
      id: true
    }
  });

  return Boolean(article);
}

async function resolveTitleID(
  title: string,
  parentID: number | null,
  excludedArticleID?: number
) {
  const baseTitleID = toKebabCase(title);

  if (!(await titleIDExists(baseTitleID, excludedArticleID))) {
    return baseTitleID;
  }

  const parentTitleID = await getParentTitleID(parentID);
  const scopedTitleID = parentTitleID
    ? `${baseTitleID}-${parentTitleID}`
    : baseTitleID;

  if (!(await titleIDExists(scopedTitleID, excludedArticleID))) {
    return scopedTitleID;
  }

  let suffix = 2;

  while (await titleIDExists(`${scopedTitleID}-${suffix}`, excludedArticleID)) {
    suffix += 1;
  }

  return `${scopedTitleID}-${suffix}`;
}

export async function createArticle(props: CreateArticleDto) {
  await isAdmin();

  const titleID = await resolveTitleID(props.title, props.parentID);

  const id = (
    await db
      .insert(articles)
      .values({
        title: props.title,
        image: props.image,
        author: props.author,
        parentID: props.parentID,
        titleID
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

  const existingArticle = await db.query.articles.findFirst({
    where: and(eq(articles.id, id), eq(articles.deleted, false)),
    columns: {
      title: true,
      parentID: true
    }
  });

  if (!existingArticle) {
    throw new Error('Article not found');
  }

  const nextTitle = props.title ?? existingArticle.title;
  const nextParentID =
    typeof props.parentID === 'undefined'
      ? existingArticle.parentID
      : props.parentID;
  const shouldRecalculateTitleID =
    typeof props.title !== 'undefined' || typeof props.parentID !== 'undefined';
  const titleID = shouldRecalculateTitleID
    ? await resolveTitleID(nextTitle, nextParentID, id)
    : undefined;

  await db
    .update(articles)
    .set({
      title: props.title,
      image: props.image,
      author: props.author,
      parentID: props.parentID,
      titleID
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

export async function deleteArticle(id: number) {
  await isAdmin();

  const article = await db.query.articles.findFirst({
    where: and(eq(articles.id, id), eq(articles.deleted, false)),
    columns: {
      id: true,
      title: true,
      image: true
    }
  });

  if (!article) {
    throw new Error('Article not found');
  }

  const childArticles = await db
    .select({
      id: articles.id,
      title: articles.title
    })
    .from(articles)
    .where(eq(articles.parentID, id));

  const highlightedArticleReferences = await db
    .select({
      id: highlightArticles.id
    })
    .from(highlightArticles)
    .where(eq(highlightArticles.articleID, id));

  if (childArticles.length > 0 || highlightedArticleReferences.length > 0) {
    const blockers = [
      childArticles.length > 0
        ? `Articolul are ${childArticles.length} ${
            childArticles.length === 1 ? 'subarticol' : 'subarticole'
          }: ${childArticles
            .map(
              (childArticle) =>
                `"${childArticle.title}" (id ${childArticle.id})`
            )
            .join(', ')}.`
        : null,
      highlightedArticleReferences.length > 0
        ? `Articolul este recomandat în ${
            highlightedArticleReferences.length === 1 ? 'slotul' : 'sloturile'
          } ${highlightedArticleReferences
            .map((reference) => `id ${reference.id}`)
            .join(', ')}.`
        : null
    ].filter(Boolean);

    throw new Error(
      `Articolul "${article.title}" nu poate fi șters deoarece există referințe la el: ${blockers.join(' ')}`
    );
  }

  await db
    .update(articles)
    .set({
      deleted: true
    })
    .where(eq(articles.id, id));

  revalidatePath('/', 'layout');
  revalidatePath('/admin/article', 'layout');

  return {
    image: article.image
  };
}
