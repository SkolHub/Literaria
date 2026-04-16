import { Client } from 'pg';
import { getDownloadURL, getMetadata, getStorage, listAll, ref } from 'firebase/storage';
import { UTApi, UTFile } from 'uploadthing/server';
import envConfig from '../env.config';
import { initFirebaseApp } from '../firebase.config';

type UploadedFile = {
  key: string;
  ufsUrl: string;
};

const client = new Client({
  connectionString: envConfig.DATABASE_URL
});

const utapi = new UTApi({
  token: envConfig.UPLOADTHING_TOKEN
});

const uploadCache = new Map<string, UploadedFile>();
const failedRows: string[] = [];

function sanitizeFileName(value: string) {
  const sanitized = value
    .replace(/[?#].*$/, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return sanitized || 'gallery-image';
}

async function uploadUrl(url: string, fileName: string, contentType?: string) {
  const cached = uploadCache.get(url);

  if (cached) {
    return cached;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Download failed with status ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const uploaded = await utapi.uploadFiles(
    new UTFile([arrayBuffer], sanitizeFileName(fileName), {
      type:
        contentType ||
        response.headers.get('content-type')?.split(';')[0] ||
        'application/octet-stream'
    })
  );

  if (uploaded.error || !uploaded.data) {
    throw new Error(
      uploaded.error?.message || `UploadThing upload failed for ${fileName}`
    );
  }

  const migrated = {
    key: uploaded.data.key,
    ufsUrl: uploaded.data.ufsUrl
  };

  uploadCache.set(url, migrated);

  return migrated;
}

async function main() {
  await client.connect();

  try {
    const existingCount = (
      await client.query<{ count: number }>(
        'select count(*)::int as count from gallery_images'
      )
    ).rows[0]?.count;

    if ((existingCount ?? 0) > 0) {
      throw new Error(
        `gallery_images already has ${existingCount} rows; refusing to create duplicates`
      );
    }

    const storage = getStorage(
      initFirebaseApp(),
      'gs://literaria-info.appspot.com'
    );
    const imagesRef = ref(storage, 'gallery');
    const listed = await listAll(imagesRef);

    console.log(
      JSON.stringify(
        {
          firebaseGalleryItems: listed.items.length
        },
        null,
        2
      )
    );

    let migrated = 0;

    for (const item of listed.items) {
      try {
        const [metadata, downloadUrl] = await Promise.all([
          getMetadata(item),
          getDownloadURL(item)
        ]);
        const title = metadata.customMetadata?.title?.trim();
        const description = metadata.customMetadata?.description?.trim() ?? '';

        if (!title) {
          throw new Error('Missing Firebase customMetadata.title');
        }

        const uploaded = await uploadUrl(
          downloadUrl,
          item.name,
          metadata.contentType || undefined
        );

        await client.query(
          `
            insert into gallery_images (file_key, url, title, description, created_at, updated_at)
            values ($1, $2, $3, $4, now(), now())
          `,
          [uploaded.key, uploaded.ufsUrl, title, description]
        );

        migrated += 1;
        console.log(
          `[gallery] migrated ${item.name} -> ${uploaded.key} (${title})`
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown gallery migration error';
        failedRows.push(`${item.fullPath}:${message}`);
        console.error(`[gallery] failed ${item.fullPath}: ${message}`);
      }
    }

    console.log(
      JSON.stringify(
        {
          migrated,
          failedRows
        },
        null,
        2
      )
    );

    if (failedRows.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
