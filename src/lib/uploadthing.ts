import { isAdminRequest } from '@/api/admin/auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const imageUploadConfig = {
  image: {
    maxFileCount: 1,
    maxFileSize: '16MB'
  }
} as const;

export const uploadRouter = {
  articleCover: f(imageUploadConfig)
    .middleware(async ({ req }) => {
      await isAdminRequest(req);
      return {};
    })
    .onUploadComplete(() => {}),
  galleryImage: f(imageUploadConfig)
    .middleware(async ({ req }) => {
      await isAdminRequest(req);
      return {};
    })
    .onUploadComplete(() => {})
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
