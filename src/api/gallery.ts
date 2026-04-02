'use server';

import { isAdmin } from '@/api/admin/auth';
import { db } from '@/db/db';
import { galleryImages } from '@/db/schema/gallery-images';
import { asc, count } from 'drizzle-orm';

export async function getGalleryPhotos() {
  try {
    const images = await db
      .select()
      .from(galleryImages)
      .orderBy(asc(galleryImages.title), asc(galleryImages.fileKey));

    return images.map((image) => ({
      key: image.fileKey,
      url: image.url,
      metadata: {
        title: image.title,
        description: image.description || undefined
      }
    }));
  } catch (error) {
    console.error('Error listing files', error);
    return [];
  }
}

export async function getGalleryPhotosCount() {
  try {
    const result = await db
      .select({
        count: count()
      })
      .from(galleryImages);

    return result[0]?.count ?? 0;
  } catch (error) {
    console.error('Error listing files', error);
    return 0;
  }
}
