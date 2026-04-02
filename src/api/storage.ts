'use server';

import { isAdmin } from '@/api/admin/auth';
import { deleteImage, uploadImage } from '@/lib/storage/r2';
import { getObjectKeyFromUrl } from '@/lib/utils/storage-key';
import envConfig from '../../env.config';

export async function uploadCoverImage(formData: FormData) {
  await isAdmin();

  const file = formData.get('file');

  if (!(file instanceof File)) {
    throw new Error('Missing cover image file');
  }

  return uploadImage(file, {
    folder: 'covers'
  });
}

export async function deleteStorageObject(target: string) {
  await isAdmin();

  const key = getObjectKeyFromUrl(target, envConfig.R2_PUBLIC_BASE_URL);

  await deleteImage({ key });
}
