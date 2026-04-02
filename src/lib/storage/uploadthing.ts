import 'server-only';

import { db } from '@/db/db';
import { galleryImages } from '@/db/schema/gallery-images';
import envConfig from '../../../env.config';
import { eq, or } from 'drizzle-orm';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi({
  token: envConfig.UPLOADTHING_TOKEN
});

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, '');
}

export function getUploadThingFileKey(value: string) {
  if (!value) {
    return '';
  }

  try {
    const parsedUrl = new URL(value);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    return decodeURIComponent(pathParts[pathParts.length - 1] ?? '');
  } catch {
    return trimSlashes(value);
  }
}

export async function deleteUploadedFileByKey(key: string) {
  if (!key) {
    return;
  }

  await utapi.deleteFiles(key);
}

export async function deleteStoredFile(target: string) {
  if (!target) {
    return;
  }

  const galleryImage = await db.query.galleryImages.findFirst({
    where: or(
      eq(galleryImages.fileKey, target),
      eq(galleryImages.url, target)
    )
  });

  const fileKey = galleryImage?.fileKey ?? getUploadThingFileKey(target);

  if (!fileKey) {
    return;
  }

  await deleteUploadedFileByKey(fileKey);

  if (galleryImage) {
    await db.delete(galleryImages).where(eq(galleryImages.id, galleryImage.id));
  }
}
