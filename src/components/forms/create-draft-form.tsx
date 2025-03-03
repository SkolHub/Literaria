'use client';

import { createDrafts } from '@/api/admin/draft';
import UploadImage from '@/components/forms/upload-image';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
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
  const [markdown, setMarkdown] = useState<string>(props.content ?? '');
  const [title, setTitle] = useState<string>(props.title ?? '');
  const [author, setAuthor] = useState<string>(props.author ?? '');
  const [authors, setAuthors] = useState<string[]>(
    [...new Set(props.articles.map((article) => article.author))].sort()
  );
  const [image, setImage] = useState<string>(props.imageUrl ?? '');
  const [parentID, setParentID] = useState<string>(
    props.parentID?.toString() ?? '-1'
  );

  const [status, setStatus] = useState('idle');

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
      <UploadImage image={image} setImage={setImage} />
      <MDEditor markdown={markdown} setMarkdown={setMarkdown} />
      <div className='flex gap-4'>
        <Button
          variant='outline'
          className='grow basis-0'
          disabled={status !== 'idle'}
          onClick={async () => {
            setStatus('saving');

            await createDrafts([
              {
                content: markdown,
                title: title,
                author: author,
                parentID: parentID === '-1' ? undefined : +parentID,
                image: image
              }
            ]);

            setStatus('idle');
          }}
        >
          {status === 'idle' ? 'Salvează' : 'Se salvează...'}
        </Button>
      </div>
    </div>
  );
}
