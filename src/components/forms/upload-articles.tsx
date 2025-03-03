import { wordToMd } from '@/lib/utils/word-to-md';

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
  async function handleArticlesUpload(e: any) {
    const articles = await Promise.all(
      Array.from(e.target.files).map((file: any) => wordToMd(file))
    );

    onUpload(
      articles.map((el, index) => ({
        content: el,
        title: e.target.files[index].name.replace(/.[Dd][Oo][Cc][Xx]?/g, '')
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
