import { isAdminRequest } from '@/api/admin/auth';
import { db } from '@/db/db';
import { galleryImages } from '@/db/schema/gallery-images';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { z } from 'zod';

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
    .input(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().trim().default('')
      })
    )
    .middleware(async ({ req, input }) => {
      await isAdminRequest(req);
      return {
        title: input.title,
        description: input.description
      };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await db.insert(galleryImages).values({
        fileKey: file.key,
        url: file.ufsUrl,
        title: metadata.title,
        description: metadata.description
      });
    })
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
