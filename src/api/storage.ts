'use server';

import { isAdmin } from '@/api/admin/auth';
import { deleteStoredFile } from '@/lib/storage/uploadthing';

export async function deleteStorageObject(target: string) {
  await isAdmin();
  await deleteStoredFile(target);
}
