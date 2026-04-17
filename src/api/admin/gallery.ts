'use server';

import { isAdmin } from '@/api/admin/auth';
import { db } from '@/db/db';
import { galleryImages } from '@/db/schema/gallery-images';
import { sql } from 'drizzle-orm';

interface SaveGalleryImageDto {
  fileKey: string;
  url: string;
  title: string;
  description?: string;
}

export async function saveGalleryImage(props: SaveGalleryImageDto) {
  await isAdmin();

  const fileKey = props.fileKey.trim();
  const url = props.url.trim();
  const title = props.title.trim();
  const description = props.description?.trim() ?? '';

  if (!fileKey || !url || !title) {
    throw new Error('Missing gallery image data');
  }

  const [savedImage] = await db
    .insert(galleryImages)
    .values({
      fileKey,
      url,
      title,
      description
    })
    .onConflictDoUpdate({
      target: galleryImages.fileKey,
      set: {
        url,
        title,
        description,
        updatedAt: sql`now()`
      }
    })
    .returning({
      fileKey: galleryImages.fileKey,
      url: galleryImages.url,
      title: galleryImages.title,
      description: galleryImages.description
    });

  if (!savedImage) {
    throw new Error('Failed to save gallery image');
  }

  return savedImage;
}
