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
  image: string;
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

const downloadCache = new Map<string, UploadedFile>();
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
    const fileName = decodeURIComponent(parsedUrl.pathname).split('/').pop();

    if (fileName) {
      return sanitizeFileName(fileName);
    }
  } catch {
    // Fall back to generated name below.
  }

  return `${fallbackBase}.bin`;
}

async function downloadWithCurl(url: string, outputPath: string) {
  const parsedUrl = new URL(url);
  const curlArgs = [
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
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
  ];

  if (parsedUrl.hostname === 'www.rador.ro') {
    curlArgs.push('-k');
  }

  curlArgs.push('-o', outputPath, url);

  const proc = Bun.spawn(['curl', ...curlArgs], {
    stdout: 'pipe',
    stderr: 'pipe'
  });

  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    const stderr = await new Response(proc.stderr).text();
    throw new Error(stderr.trim() || `curl exited with code ${exitCode}`);
  }
}

async function uploadFromUrl(url: string, fallbackBase: string): Promise<UploadedFile> {
  const cached = downloadCache.get(url);

  if (cached) {
    return cached;
  }

  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'literaria-upload-'));
  const fileName = getFileNameFromUrl(url, fallbackBase);
  const filePath = path.join(tmpDir, fileName);

  try {
    await downloadWithCurl(url, filePath);

    const fileBuffer = await readFile(filePath);
    const uploaded = await utapi.uploadFiles(
      new UTFile([fileBuffer], fileName, {
        type: 'application/octet-stream'
      })
    );

    if (uploaded.error || !uploaded.data) {
      throw new Error(
        uploaded.error?.message || `UploadThing upload failed for ${fileName}`
      );
    }

    const migratedFile = {
      key: uploaded.data.key,
      ufsUrl: uploaded.data.ufsUrl
    };

    downloadCache.set(url, migratedFile);

    return migratedFile;
  } finally {
    await rm(tmpDir, { force: true, recursive: true });
  }
}

async function main() {
  await client.connect();

  try {
    const query = `
      select id, image
      from articles
      where image <> ''
        and split_part(split_part(image, '://', 2), '/', 1) <> 'utfs.io'
        and split_part(split_part(image, '://', 2), '/', 1) not like '%.ufs.sh'
      order by id
    `;
    const rows = (await client.query<ArticleRow>(query)).rows;

    console.log(
      JSON.stringify(
        {
          retryCandidates: rows.length
        },
        null,
        2
      )
    );

    let migrated = 0;

    for (const row of rows) {
      if (!row.image || isUploadThingUrl(row.image)) {
        continue;
      }

      try {
        const uploaded = await uploadFromUrl(row.image, `article-${row.id}`);

        await client.query('update articles set image = $1 where id = $2', [
          uploaded.ufsUrl,
          row.id
        ]);

        migrated += 1;
        console.log(
          `[retry] migrated ${row.id} -> ${uploaded.key} (${uploaded.ufsUrl})`
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown retry error';
        failedRows.push(`articles:${row.id}:${message}`);
        console.error(`[retry] failed ${row.id}: ${message}`);
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
