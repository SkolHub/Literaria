'use server';

import { isAdmin } from '@/api/admin/auth';
import {
  countGalleryImages,
  listGalleryImages,
  uploadImage
} from '@/lib/storage/r2';

export async function createImage(formData: FormData) {
  await isAdmin();

  const file = formData.get('file');
  const title = formData.get('title');
  const description = formData.get('description');

  if (!(file instanceof File)) {
    throw new Error('Missing gallery image file');
  }

  if (typeof title !== 'string' || title.trim() === '') {
    throw new Error('Missing gallery image title');
  }

  await uploadImage(file, {
    folder: 'gallery',
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : ''
  });
}

export async function getGalleryPhotos() {
  try {
    return await listGalleryImages();
  } catch (error) {
    console.error('Error listing files', error);
    return [];
  }
}

export async function getGalleryPhotosCount() {
  try {
    return await countGalleryImages();
  } catch (error) {
    console.error('Error listing files', error);
    return 0;
  }
}
