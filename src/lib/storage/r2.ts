import 'server-only';

import type { Image, ImageMetadata } from '@/lib/types';
import envConfig from '../../../env.config';

function getRequiredEnv(name: keyof typeof envConfig) {
  const value = envConfig[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, '');
}

function normalizePrefix(prefix: string) {
  return `${trimSlashes(prefix)}/`;
}

function getPublicBaseUrl() {
  return getRequiredEnv('R2_PUBLIC_BASE_URL').replace(/\/+$/, '');
}

async function getS3Module() {
  return import('@aws-sdk/client-s3');
}

function getS3Endpoint() {
  const endpoint = new URL(getRequiredEnv('R2_S3_ENDPOINT'));
  const bucket = getBucket();
  const normalizedPath = trimSlashes(endpoint.pathname);

  if (normalizedPath === bucket) {
    endpoint.pathname = '';
  }

  return endpoint.toString();
}

async function getS3Client() {
  const { S3Client } = await getS3Module();

  return new S3Client({
    region: envConfig.R2_REGION ?? 'auto',
    endpoint: getS3Endpoint(),
    forcePathStyle: true,
    credentials: {
      accessKeyId: getRequiredEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: getRequiredEnv('R2_SECRET_ACCESS_KEY')
    }
  });
}

function getBucket() {
  return getRequiredEnv('R2_BUCKET');
}

function getFileExtension(file: File) {
  const fileNameExt = file.name.split('.').pop()?.trim().toLowerCase();

  if (fileNameExt) {
    return fileNameExt;
  }

  const mimeExt = file.type.split('/').pop()?.trim().toLowerCase();

  if (mimeExt === 'jpeg') {
    return 'jpg';
  }

  return mimeExt || 'bin';
}

function buildObjectKey(folder: string, file: File) {
  return `${trimSlashes(folder)}/${crypto.randomUUID()}.${getFileExtension(file)}`;
}

function buildPublicUrl(key: string) {
  return `${getPublicBaseUrl()}/${trimSlashes(key)}`;
}

function normalizeMetadata(
  metadata?: Record<string, string>,
  contentType?: string
): ImageMetadata {
  return {
    title: metadata?.title,
    description: metadata?.description,
    contentType
  };
}

export async function uploadImage(
  file: File,
  options: {
    folder: 'covers' | 'gallery';
    title?: string;
    description?: string;
  }
) {
  const key = buildObjectKey(options.folder, file);
  const client = await getS3Client();
  const { PutObjectCommand } = await getS3Module();

  const res = await client.send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type || 'application/octet-stream',
      Metadata:
        options.folder === 'gallery'
          ? {
              ...(options.title ? { title: options.title } : {}),
              ...(options.description
                ? { description: options.description }
                : {})
            }
          : undefined
    })
  );

  console.log(res);

  return {
    key,
    url: buildPublicUrl(key)
  };
}

export async function deleteImage({ key }: { key: string }) {
  if (!key) {
    return;
  }

  const client = await getS3Client();
  const { DeleteObjectCommand } = await getS3Module();

  await client.send(
    new DeleteObjectCommand({
      Bucket: getBucket(),
      Key: key
    })
  );
}

async function listAllKeys(prefix: string) {
  const client = await getS3Client();
  const { ListObjectsV2Command } = await getS3Module();
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: getBucket(),
        Prefix: normalizePrefix(prefix),
        ContinuationToken: continuationToken
      })
    );

    keys.push(
      ...(response.Contents ?? [])
        .map((item) => item.Key)
        .filter((item): item is string => Boolean(item && !item.endsWith('/')))
    );

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return keys;
}

export async function listGalleryImages(): Promise<Image[]> {
  const client = await getS3Client();
  const { HeadObjectCommand } = await getS3Module();
  const keys = await listAllKeys('gallery/');

  const images = await Promise.all(
    keys.map(async (key) => {
      const head = await client.send(
        new HeadObjectCommand({
          Bucket: getBucket(),
          Key: key
        })
      );

      return {
        key,
        url: buildPublicUrl(key),
        metadata: normalizeMetadata(head.Metadata, head.ContentType)
      };
    })
  );

  return images.sort((left, right) => left.key.localeCompare(right.key));
}

export async function countGalleryImages() {
  const keys = await listAllKeys('gallery/');
  return keys.length;
}
