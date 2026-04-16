import { Client } from 'pg';
import envConfig from '../env.config';
import { UTApi, UTFile } from 'uploadthing/server';

type ArticleRow = {
  id: number;
  image: string;
};

type DraftRow = {
  id: number;
  image: string;
};

type GalleryRow = {
  id: number;
  file_key: string;
  url: string;
  title: string;
  description: string;
};

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

function isUploadThingUrl(value: string) {
  if (!value) {
    return false;
  }

  try {
    const host = new URL(value).hostname;
    return host === 'utfs.io' || host.endsWith('.ufs.sh');
  } catch {
    return false;
  }
}

function sanitizeFileName(value: string) {
  const sanitized = value
    .replace(/[?#].*$/, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return sanitized || 'file';
}

function getFileNameFromUrl(url: string, fallbackBase: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.pathname.includes('/o/')) {
      const [, encodedObjectPath = ''] = parsedUrl.pathname.split('/o/');
      const decodedPath = decodeURIComponent(encodedObjectPath);
      const firebaseName = decodedPath.split('/').pop();

      if (firebaseName) {
        return sanitizeFileName(firebaseName);
      }
    }

    const pathName = decodeURIComponent(parsedUrl.pathname);
    const directName = pathName.split('/').pop();

    if (directName) {
      return sanitizeFileName(directName);
    }
  } catch {
    // Fall back to generated name below.
  }

  return `${fallbackBase}.bin`;
}

async function uploadUrl(url: string, fallbackBase: string): Promise<UploadedFile> {
  const cached = uploadCache.get(url);

  if (cached) {
    return cached;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Download failed with status ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType =
    response.headers.get('content-type')?.split(';')[0] ||
    'application/octet-stream';
  const fileName = getFileNameFromUrl(url, fallbackBase);
  const file = new UTFile([arrayBuffer], fileName, {
    type: contentType
  });
  const uploaded = await utapi.uploadFiles(file);

  if (uploaded.error || !uploaded.data) {
    throw new Error(
      uploaded.error?.message || `UploadThing upload failed for ${fileName}`
    );
  }

  const migratedFile = {
    key: uploaded.data.key,
    ufsUrl: uploaded.data.ufsUrl
  };

  uploadCache.set(url, migratedFile);

  return migratedFile;
}

async function migrateArticles(rows: ArticleRow[]) {
  let migrated = 0;

  for (const row of rows) {
    if (!row.image || isUploadThingUrl(row.image)) {
      continue;
    }

    try {
      const uploaded = await uploadUrl(row.image, `article-${row.id}`);

      await client.query('update articles set image = $1 where id = $2', [
        uploaded.ufsUrl,
        row.id
      ]);

      migrated += 1;
      console.log(
        `[articles] migrated ${row.id} -> ${uploaded.key} (${uploaded.ufsUrl})`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown migration error';
      failedRows.push(`articles:${row.id}:${message}`);
      console.error(`[articles] failed ${row.id}: ${message}`);
    }
  }

  return migrated;
}

async function migrateDrafts(rows: DraftRow[]) {
  let migrated = 0;

  for (const row of rows) {
    if (!row.image || isUploadThingUrl(row.image)) {
      continue;
    }

    try {
      const uploaded = await uploadUrl(row.image, `draft-${row.id}`);

      await client.query('update drafts set image = $1 where id = $2', [
        uploaded.ufsUrl,
        row.id
      ]);

      migrated += 1;
      console.log(
        `[drafts] migrated ${row.id} -> ${uploaded.key} (${uploaded.ufsUrl})`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown migration error';
      failedRows.push(`drafts:${row.id}:${message}`);
      console.error(`[drafts] failed ${row.id}: ${message}`);
    }
  }

  return migrated;
}

async function migrateGallery(rows: GalleryRow[]) {
  let migrated = 0;

  for (const row of rows) {
    if (!row.url || isUploadThingUrl(row.url)) {
      continue;
    }

    try {
      const uploaded = await uploadUrl(row.url, `gallery-${row.id}`);

      await client.query(
        `
          update gallery_images
          set file_key = $1,
              url = $2,
              updated_at = now()
          where id = $3
        `,
        [uploaded.key, uploaded.ufsUrl, row.id]
      );

      migrated += 1;
      console.log(
        `[gallery] migrated ${row.id} (${row.title}) -> ${uploaded.key} (${uploaded.ufsUrl})`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown migration error';
      failedRows.push(`gallery_images:${row.id}:${message}`);
      console.error(`[gallery] failed ${row.id}: ${message}`);
    }
  }

  return migrated;
}

async function main() {
  await client.connect();

  try {
    const [articleRows, draftRows, galleryRows] = await Promise.all([
      client.query<ArticleRow>('select id, image from articles where image <> \'\''),
      client.query<DraftRow>('select id, image from drafts where image <> \'\''),
      client.query<GalleryRow>(
        'select id, file_key, url, title, description from gallery_images'
      )
    ]);

    const articleCandidates = articleRows.rows.filter(
      (row) => !isUploadThingUrl(row.image)
    );
    const draftCandidates = draftRows.rows.filter(
      (row) => !isUploadThingUrl(row.image)
    );
    const galleryCandidates = galleryRows.rows.filter(
      (row) => !isUploadThingUrl(row.url)
    );

    console.log(
      JSON.stringify(
        {
          articleCandidates: articleCandidates.length,
          draftCandidates: draftCandidates.length,
          galleryCandidates: galleryCandidates.length
        },
        null,
        2
      )
    );

    const migratedArticles = await migrateArticles(articleCandidates);
    const migratedDrafts = await migrateDrafts(draftCandidates);
    const migratedGallery = await migrateGallery(galleryCandidates);

    console.log(
      JSON.stringify(
        {
          migratedArticles,
          migratedDrafts,
          migratedGallery,
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
