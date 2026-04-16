import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Client } from 'pg';
import envConfig from '../env.config';
import { UTApi, UTFile } from 'uploadthing/server';

declare const Bun: {
  spawn(
    args: string[],
    options: {
      stdout?: 'pipe';
      stderr?: 'pipe';
    }
  ): {
    exited: Promise<number>;
    stderr: BodyInit | null;
  };
};

type ArticleRow = {
  id: number;
  title_id: string;
  image: string;
};

function sanitizeFileName(value: string) {
  const sanitized = value
    .replace(/[?#].*$/, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return sanitized || 'wikimedia-file';
}

function toWikimediaOriginalUrl(value: string) {
  const parsed = new URL(value);
  const parts = parsed.pathname.split('/');
  const thumbIndex = parts.indexOf('thumb');

  if (thumbIndex === -1 || parts.length < thumbIndex + 3) {
    return value;
  }

  parts.splice(thumbIndex, 1);
  parts.pop();

  parsed.pathname = parts.join('/');
  parsed.search = '';

  return parsed.toString();
}

function inferContentType(fileName: string) {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith('.png')) {
    return 'image/png';
  }

  if (lowerName.endsWith('.webp')) {
    return 'image/webp';
  }

  if (lowerName.endsWith('.gif')) {
    return 'image/gif';
  }

  if (lowerName.endsWith('.svg')) {
    return 'image/svg+xml';
  }

  return 'image/jpeg';
}

async function downloadWithCurl(url: string, outputPath: string) {
  const proc = Bun.spawn(
    [
      'curl',
      '-L',
      '--fail',
      '--silent',
      '--show-error',
      '--retry',
      '4',
      '--retry-delay',
      '2',
      '--retry-all-errors',
      '--user-agent',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      '-o',
      outputPath,
      url
    ],
    {
      stdout: 'pipe',
      stderr: 'pipe'
    }
  );

  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    const stderr = await new Response(proc.stderr).text();
    throw new Error(stderr.trim() || `curl exited with code ${exitCode}`);
  }
}

async function fetchUsableWikimediaSource(url: string) {
  const originalUrl = toWikimediaOriginalUrl(url);
  const preferredUrl = originalUrl.toLowerCase().endsWith('.pdf')
    ? url
    : originalUrl;
  const fallbackUrl = preferredUrl === url ? null : url;
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'literaria-wikimedia-'));

  try {
    const preferredFileName = sanitizeFileName(
      decodeURIComponent(new URL(preferredUrl).pathname.split('/').pop() || '')
    );
    const preferredPath = path.join(tmpDir, preferredFileName);

    try {
      await downloadWithCurl(preferredUrl, preferredPath);

      return {
        sourceUrl: preferredUrl,
        fileName: preferredFileName,
        contentType: inferContentType(preferredFileName),
        bytes: await readFile(preferredPath)
      };
    } catch (preferredError) {
      if (!fallbackUrl) {
        throw preferredError;
      }

      const fallbackFileName = sanitizeFileName(
        decodeURIComponent(new URL(fallbackUrl).pathname.split('/').pop() || '')
      );
      const fallbackPath = path.join(tmpDir, fallbackFileName);

      await downloadWithCurl(fallbackUrl, fallbackPath);

      return {
        sourceUrl: fallbackUrl,
        fileName: fallbackFileName,
        contentType: inferContentType(fallbackFileName),
        bytes: await readFile(fallbackPath)
      };
    }
  } finally {
    await rm(tmpDir, { force: true, recursive: true });
  }
}

async function main() {
  const client = new Client({
    connectionString: envConfig.DATABASE_URL
  });
  const utapi = new UTApi({
    token: envConfig.UPLOADTHING_TOKEN
  });
  const failedRows: string[] = [];

  await client.connect();

  try {
    const rows = (
      await client.query<ArticleRow>(
        `
          select id, title_id, image
          from articles
          where image like 'https://upload.wikimedia.org/%'
          order by id
        `
      )
    ).rows;

    console.log(
      JSON.stringify(
        {
          wikimediaCandidates: rows.length
        },
        null,
        2
      )
    );

    let migrated = 0;

    for (const row of rows) {
      try {
        const { sourceUrl, bytes, fileName, contentType } =
          await fetchUsableWikimediaSource(
          row.image
        );
        const uploaded = await utapi.uploadFiles(
          new UTFile([bytes], fileName, {
            type: contentType
          })
        );

        if (uploaded.error || !uploaded.data) {
          throw new Error(
            uploaded.error?.message ||
              `UploadThing upload failed for ${row.title_id}`
          );
        }

        await client.query('update articles set image = $1 where id = $2', [
          uploaded.data.ufsUrl,
          row.id
        ]);

        migrated += 1;
        console.log(
          `[wikimedia] migrated ${row.title_id} using ${sourceUrl} -> ${uploaded.data.ufsUrl}`
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown Wikimedia migration error';
        failedRows.push(`${row.title_id}:${message}`);
        console.error(`[wikimedia] failed ${row.title_id}: ${message}`);
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
