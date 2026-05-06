import { wordToMd } from '@/lib/utils/word-to-md';
import { ChangeEvent } from 'react';

export default function ({
  onUpload
}: {
  onUpload: (
    articles: {
      content: string;
      title: string;
    }[]
  ) => void;
}) {
  async function handleArticlesUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const articles = await Promise.all(
      files.map((file) => wordToMd(file))
    );

    onUpload(
      articles.map((el, index) => ({
        content: el,
        title: files[index].name.replace(/.[Dd][Oo][Cc][Xx]?/g, '')
      }))
    );
  }

  return (
    <div className='relative cursor-pointer'>
      <div
        onClick={() => document.getElementById('image-upload')!.click()}
        className='flex h-60 cursor-pointer select-none items-center justify-center rounded-lg border-2 border-dashed border-neutral-400'
      >
        Încărcați articole
      </div>
      <input
        id='image-upload'
        type='file'
        className='hidden'
        multiple={true}
        onChange={handleArticlesUpload}
      />
    </div>
  );
}
