'use client';

import { createArticle, updateArticle } from '@/api/admin/article';
import { deleteStorageObject } from '@/api/storage';
import ArticleParentPicker from '@/components/forms/article-parent-picker';
import UploadImage from '@/components/forms/upload-image';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { useUploadThing } from '@/lib/uploadthing-client';
import { Save } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const MDEditor = dynamic(() => import('../markdown/markdown-editor'), {
  ssr: false
});

const ROOT_PARENT_VALUE = '-1';

function getDescendantIds(
  currentArticleId: number | undefined,
  articles: {
    id: number;
    parentID: number | null;
  }[]
) {
  const blockedIds = new Set<number>();

  if (!currentArticleId) {
    return blockedIds;
  }

  blockedIds.add(currentArticleId);

  let changed = true;

  while (changed) {
    changed = false;

    for (const article of articles) {
      if (
        article.parentID !== null &&
        blockedIds.has(article.parentID) &&
        !blockedIds.has(article.id)
      ) {
        blockedIds.add(article.id);
        changed = true;
      }
    }
  }

  return blockedIds;
}

export default function ArticleForm(props: {
  title?: string;
  author?: string;
  imageUrl?: string;
  content?: string;
  parentID?: number;
  id?: number;
  children?: {
    id: number;
    title: string;
    image: string;
  }[];
  articles: {
    id: number;
    parentID: number | null;
    author: string;
    title: string;
    titleID?: string;
  }[];
}) {
  const router = useRouter();

  const [markdown, setMarkdown] = useState<string>(props.content ?? '');
  const [title, setTitle] = useState<string>(props.title ?? '');
  const [author, setAuthor] = useState<string>(props.author?.trim() ?? '');
  const [authors, setAuthors] = useState<string[]>(
    [...new Set(props.articles.map((article) => article.author.trim()))]
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right))
  );
  const [image, setImage] = useState<string>(props.imageUrl ?? '');
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [parentID, setParentID] = useState<string>(
    props.parentID?.toString() ?? ROOT_PARENT_VALUE
  );
  const [status, setStatus] = useState<'idle' | 'saving'>('idle');
  const [error, setError] = useState<string | null>(null);
  const { startUpload, isUploading } = useUploadThing('articleCover', {
    onUploadError: (uploadError) => {
      console.error('Error uploading article cover:', uploadError);
    }
  });

  const articleMap = new Map(
    props.articles.map((article) => [article.id, article])
  );
  const blockedParentIds = getDescendantIds(props.id, props.articles);

  const authorUsage = authors
    .map((authorName) => ({
      authorName,
      count: props.articles.filter(
        (article) => article.author.trim() === authorName
      ).length
    }))
    .sort(
      (left, right) =>
        right.count - left.count ||
        left.authorName.localeCompare(right.authorName)
    );

  const authorOptions = authorUsage.map(({ authorName, count }) => ({
    value: authorName,
    label: authorName,
    description: `${count} ${count === 1 ? 'articol' : 'articole'}`,
    keywords: [authorName]
  }));

  const availableParentArticles = props.articles.filter(
    (article) => !blockedParentIds.has(article.id)
  );
  const selectedParent =
    parentID !== ROOT_PARENT_VALUE ? articleMap.get(+parentID) : undefined;

  const isFormIncomplete =
    title.trim().length === 0 ||
    author.trim().length === 0 ||
    markdown.trim().length === 0;

  return (
    <div className='flex w-full max-w-[980px] flex-col gap-5'>
      <h1 className='text-3xl font-semibold tracking-tight text-neutral-950'>
        {props.id ? 'Editează articolul' : 'Creează un articol nou'}
      </h1>

      <div className='xl:grid-cols-[minmax(0,1fr)_280px] grid gap-5'>
        <div className='flex min-w-0 flex-col gap-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-neutral-700'>
              Titlu
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Titlu'
              className='h-11 rounded-xl'
            />
          </div>

          <div className='md:grid-cols-2 grid gap-4'>
            <div>
              <label className='mb-2 block text-sm font-medium text-neutral-700'>
                Autor
              </label>
              <Combobox
                mode='single'
                options={authorOptions}
                placeholder='Selectează autorul...'
                searchPlaceholder='Caută autor...'
                emptyMessage='Nu există un autor care să corespundă.'
                selected={author}
                onChange={(value) => {
                  setAuthor(value as string);
                }}
                onCreate={(value) => {
                  const trimmedValue = value.trim();

                  if (!trimmedValue) {
                    return;
                  }

                  setAuthors((currentAuthors) =>
                    [...new Set([...currentAuthors, trimmedValue])].sort(
                      (left, right) => left.localeCompare(right)
                    )
                  );
                }}
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-neutral-700'>
                Părinte
              </label>
              <ArticleParentPicker
                articles={availableParentArticles}
                selectedParentId={
                  parentID === ROOT_PARENT_VALUE ? null : Number(parentID)
                }
                onSelect={(id) => {
                  setParentID(id === null ? ROOT_PARENT_VALUE : id.toString());
                }}
              />
            </div>
          </div>

          <div className='min-w-0'>
            <MDEditor markdown={markdown} setMarkdown={setMarkdown} />
          </div>
        </div>

        <div className='flex min-w-0 flex-col gap-4'>
          <UploadImage
            image={image}
            pendingImageFile={pendingImageFile}
            setPendingImageFile={setPendingImageFile}
            isUploading={isUploading}
          />

          {error ? (
            <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
              {error}
            </div>
          ) : null}

          <Button
            disabled={status !== 'idle' || isUploading || isFormIncomplete}
            className='h-11 w-full rounded-xl'
            onClick={async () => {
              setStatus('saving');
              setError(null);

              const previousImage = image;
              let nextImage = image;
              let uploadedImageUrl: string | null = null;

              try {
                if (pendingImageFile) {
                  const uploadResult = await startUpload([pendingImageFile]);
                  const uploadedFile = uploadResult?.[0];

                  if (!uploadedFile?.ufsUrl) {
                    throw new Error('Image upload failed');
                  }

                  uploadedImageUrl = uploadedFile.ufsUrl;
                  nextImage = uploadedFile.ufsUrl;
                }

                if (props.id) {
                  await updateArticle(props.id, {
                    content: markdown,
                    author: author.trim(),
                    title: title.trim(),
                    image: nextImage,
                    parentID: parentID === ROOT_PARENT_VALUE ? null : +parentID
                  });
                } else {
                  const articleID = await createArticle({
                    content: markdown,
                    author: author.trim(),
                    title: title.trim(),
                    image: nextImage,
                    parentID: parentID === ROOT_PARENT_VALUE ? null : +parentID
                  });

                  setImage(nextImage);
                  setPendingImageFile(null);
                  router.push(`/admin/article/${articleID}`);
                  return;
                }

                if (uploadedImageUrl) {
                  setImage(uploadedImageUrl);
                  setPendingImageFile(null);

                  if (previousImage && previousImage !== uploadedImageUrl) {
                    try {
                      await deleteStorageObject(previousImage);
                    } catch (cleanupError) {
                      console.error(
                        'Failed to delete replaced article image:',
                        cleanupError
                      );
                    }
                  }
                }
              } catch {
                if (uploadedImageUrl) {
                  await deleteStorageObject(uploadedImageUrl);
                }

                setError(
                  'Salvarea a eșuat. Verifică datele completate și încearcă din nou.'
                );
              } finally {
                setStatus('idle');
              }
            }}
          >
            <Save className='h-4 w-4' />
            {status === 'idle' ? 'Salvează' : 'Se salvează...'}
          </Button>
        </div>
      </div>
    </div>
  );
}
