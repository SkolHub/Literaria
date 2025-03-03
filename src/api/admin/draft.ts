'use server';

import { isAdmin } from '@/api/admin/auth';
import { db } from '@/db/db';
import { articleContents, articles, drafts } from '@db/*';
import { eq } from 'drizzle-orm';

export async function createDrafts(articles: string[]) {
  await isAdmin();

  await db.insert(drafts).values(
    articles.map((el) => ({
      title: '',
      author: '',
      image: '',
      content: el
    }))
  );
}

export async function getDrafts() {
  await isAdmin();

  return db
    .select({
      id: drafts.id,
      title: drafts.title
    })
    .from(drafts);
}

export async function getDraftByID(id: number) {
  await isAdmin();

  return (
    await db
      .select({
        id: drafts.id,
        title: drafts.title,
        author: drafts.author,
        parentID: drafts.parentID,
        image: drafts.image,
        content: drafts.content
      })
      .from(drafts)
      .where(eq(drafts.id, id))
  )[0];
}

export interface UpdateDraftDto {
  title: string;
  content: string;
  image: string;
  author: string;
  parentID: number | null;
}

export async function updateDraft(id: number, updateDraftDto: UpdateDraftDto) {
  await isAdmin();

  await db
    .update(drafts)
    .set({
      title: updateDraftDto.title,
      content: updateDraftDto.content,
      image: updateDraftDto.image,
      author: updateDraftDto.author,
      parentID: updateDraftDto.parentID
    })
    .where(eq(drafts.id, id));
}

export async function saveAndPublishDraft(
  id: number,
  updateDraftDto: UpdateDraftDto
) {
  await isAdmin();

  await db.delete(drafts).where(eq(drafts.id, id));

  const article = (
    await db
      .insert(articles)
      .values({
        title: updateDraftDto.title,
        author: updateDraftDto.author,
        image: updateDraftDto.image,
        parentID: updateDraftDto.parentID
      })
      .returning({
        id: articles.id
      })
  )[0];

  await db.insert(articleContents).values({
    articleID: article.id,
    content: updateDraftDto.content
  });

  return article.id;
}
