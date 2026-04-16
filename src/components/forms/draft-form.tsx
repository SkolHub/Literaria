'use client';

import {
  deleteDraft,
  saveAndPublishDraft,
  updateDraft
} from '@/api/admin/draft';
import { deleteStorageObject } from '@/api/storage';
import UploadImage from '@/components/forms/upload-image';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { useUploadThing } from '@/lib/uploadthing-client';
import { Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const MDEditor = dynamic(() => import('../markdown/markdown-editor'), {
  ssr: false
});

export default function (props: {
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
  }[];
}) {
  const router = useRouter();

  const [markdown, setMarkdown] = useState<string>(props.content ?? '');
  const [title, setTitle] = useState<string>(props.title ?? '');
  const [author, setAuthor] = useState<string>(props.author ?? '');
  const [authors, setAuthors] = useState<string[]>(
    [...new Set(props.articles.map((article) => article.author))].sort()
  );
  const [image, setImage] = useState<string>(props.imageUrl ?? '');
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [parentID, setParentID] = useState<string>(
    props.parentID?.toString() ?? '-1'
  );

  const [status, setStatus] = useState('idle');
  const [status2, setStatus2] = useState('idle');
  const [status3, setStatus3] = useState('idle');
  const { startUpload, isUploading } = useUploadThing('articleCover', {
    onUploadError: (uploadError) => {
      console.error('Error uploading draft cover:', uploadError);
    }
  });

  async function deleteImage(imageUrl: string) {
    try {
      if (!imageUrl) {
        return true;
      }

      await deleteStorageObject(imageUrl);

      setImage('');

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  return (
    <div className='flex w-full max-w-[800px] flex-col gap-4'>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Titlu'
      />
      <Combobox
        mode='single'
        options={authors.map((el) => ({
          value: el,
          label: el
        }))}
        placeholder='Selectează un autor...'
        selected={author}
        onChange={(value) => {
          setAuthor(value as string);
        }}
        onCreate={(value) => {
          setAuthors([...authors, value]);
        }}
      />
      <Combobox
        mode='single'
        options={[
          ...props.articles.map((el) => ({
            value: el.id.toString(),
            label: el.title
          })),
          {
            value: '-1',
            label: 'Categorie (fără părinte)'
          }
        ]}
        placeholder='Selectează un autor...'
        selected={parentID}
        onChange={(value) => {
          setParentID(value as string);
        }}
      />
      <UploadImage
        image={image}
        pendingImageFile={pendingImageFile}
        setPendingImageFile={setPendingImageFile}
        isUploading={isUploading}
      />
      <MDEditor markdown={markdown} setMarkdown={setMarkdown} />
      <div className='flex gap-4'>
        <Button
          variant='outline'
          className='grow basis-0'
          disabled={
            status !== 'idle' ||
            status2 !== 'idle' ||
            status3 !== 'idle' ||
            isUploading
          }
          onClick={async () => {
            setStatus('saving');

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

              await updateDraft(props.id!, {
                content: markdown,
                author: author,
                title: title,
                image: nextImage,
                parentID: parentID === '-1' ? null : +parentID
              });

              if (uploadedImageUrl) {
                setImage(uploadedImageUrl);
                setPendingImageFile(null);

                if (previousImage && previousImage !== uploadedImageUrl) {
                  try {
                    await deleteStorageObject(previousImage);
                  } catch (cleanupError) {
                    console.error(
                      'Error deleting replaced draft image:',
                      cleanupError
                    );
                  }
                }
              }
            } catch (error) {
              console.error('Error saving draft:', error);

              if (uploadedImageUrl) {
                await deleteStorageObject(uploadedImageUrl);
              }
            }

            setStatus('idle');
          }}
        >
          {status === 'idle' ? 'Salvează' : 'Se salvează...'}
        </Button>
        <Button
          className='grow basis-0'
          disabled={
            status !== 'idle' ||
            status2 !== 'idle' ||
            status3 !== 'idle' ||
            isUploading
          }
          onClick={async () => {
            setStatus2('saving');

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

              const articleID = await saveAndPublishDraft(props.id!, {
                content: markdown,
                author: author,
                title: title,
                image: nextImage,
                parentID: parentID === '-1' ? null : +parentID
              });

              if (
                uploadedImageUrl &&
                previousImage &&
                previousImage !== uploadedImageUrl
              ) {
                try {
                  await deleteStorageObject(previousImage);
                } catch (cleanupError) {
                  console.error(
                    'Error deleting replaced draft image after publish:',
                    cleanupError
                  );
                }
              }

              router.push(`/admin/article/${articleID}`);
            } catch (error) {
              console.error('Error publishing draft:', error);

              if (uploadedImageUrl) {
                await deleteStorageObject(uploadedImageUrl);
              }
            }

            setStatus2('idle');
          }}
        >
          {status2 === 'idle' ? 'Publică' : 'Se publică...'}
        </Button>
      </div>
      <Button
        variant='outline'
        className='mt-4 text-red-500'
        disabled={
          status !== 'idle' ||
          status2 !== 'idle' ||
          status3 !== 'idle' ||
          isUploading
        }
        onClick={async () => {
          setStatus3('saving');

          await deleteDraft(props.id!);
          await deleteImage(image);

          router.push(`/admin/article/draft`);

          setStatus3('idle');
        }}
      >
        <Trash2 />
        {status3 === 'idle' ? 'Șterge' : 'Se șterge...'}
      </Button>
    </div>
  );
}
