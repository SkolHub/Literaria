import PhotoWithBlur from '@/components/misc/photo-with-blur';
import MainTitle from '@/components/typography/main-title';
import SmallTitle from '@/components/typography/small-title';
import { Article } from '@/lib/types';
import Link from 'next/link';

export default function ({ article }: { article: Article }) {
  const directories = article.children!.filter(
    (art) => art.children!.length !== 0
  );

  if (directories.length === 0) {
    return null;
  }

  return (
    <>
      <section
        id='authors'
        className='section flex !h-auto !min-h-dvh flex-wrap gap-8 px-8 pb-12 pt-24 mobile:hidden'
      >
        <div className='aspect-square h-[25rem] w-[25rem] pt-12'>
          <MainTitle className='pb-6 text-left'>{article.title}</MainTitle>
          <SmallTitle>Autori</SmallTitle>
        </div>
        {directories.map((art, index) => (
          <Link
            href={`/article/${art.id}`}
            className='group relative flex aspect-square h-[25rem] w-[25rem] flex-col justify-end overflow-hidden rounded-[3rem]'
            key={index}
          >
            <PhotoWithBlur
              className='h-full w-full'
              src={art.image}
              alt={art.title}
            />
            <div className='absolute bottom-0 left-0 right-0 z-[1] flex cursor-pointer rounded-[0px_0px_3rem_3rem] bg-black/20 backdrop-blur-md'>
              <label className='text-white cursor-pointer px-8 py-5 text-2xl font-medium group-hover:underline'>
                {art.title}
              </label>
            </div>
          </Link>
        ))}
      </section>
      <section className='section !hidden !h-auto !min-h-dvh gap-8 px-8 pt-10 mobile:flex mobile:flex-col mobile:px-[16px]'>
        <div className='pt-12'>
          <MainTitle className='text-left'>{article.title}</MainTitle>
          <SmallTitle className='pt-2'>Categorii</SmallTitle>
        </div>
        <div className='grid w-full grid-cols-2 gap-[16px] pb-4'>
          {directories!.map((art, index) => (
            <div
              className='relative flex aspect-square w-full flex-col justify-end overflow-hidden rounded-[1.875rem]'
              key={index}
            >
              <PhotoWithBlur
                className='h-full w-full'
                src={art.image}
                alt={art.title}
              />
              <div className='absolute bottom-0 z-50 flex w-full bg-black/50 px-6 backdrop-blur-md'>
                <label className='py-2 text-[1rem] font-medium leading-tight text-white'>
                  {article.title}
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
