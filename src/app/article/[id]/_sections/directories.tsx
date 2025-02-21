import MainTitle from '@/components/typography/main-title';
import SmallTitle from '@/components/typography/small-title';
import { Article } from '@/lib/types';
import Link from 'next/link';

export default function ({ article }: { article: Article }) {
  const directories = article.children!.filter(
    (art) => art.children!.length !== 0
  );

  if (directories.length === 0) {
    return '';
  }

  return (
    <>
      <section
        id='authors'
        className='section flex !h-auto !min-h-[100svh] flex-wrap gap-8 px-8 pb-12 pt-24 mobile:hidden'
      >
        <div className='aspect-square h-[25rem] w-[25rem] pt-12'>
          <MainTitle className='pb-6 text-left'>{article.title}</MainTitle>
          <SmallTitle>Autori</SmallTitle>
        </div>
        {directories.map((art, index) => (
          <Link href={`/article/${art.id}`}>
            <div
              className='relative flex aspect-square h-[25rem] w-[25rem] flex-col justify-end rounded-[3rem]'
              key={index}
            >
              <img
                className='absolute left-0 top-0 h-full w-full rounded-[3rem] object-cover'
                src={art.image}
                alt={art.title}
              />
              <div className='relative z-[100] flex h-1/5 w-full items-center rounded-[0px_0px_3rem_3rem] bg-[rgba(0,0,0,0.50)] pl-8 backdrop-blur-[1rem]'>
                <label className='pb-3 text-[2rem] font-medium text-white'>
                  {art.title}
                </label>
              </div>
            </div>
          </Link>
        ))}
      </section>
      <section className='section !hidden !h-auto !min-h-[100svh] flex-wrap gap-8 px-8 pt-24 mobile:!flex mobile:px-[16px]'>
        <div className='pt-12'>
          <MainTitle className='text-left'>{article.title}</MainTitle>
          <SmallTitle>Categorii</SmallTitle>
        </div>
        <div className='grid w-full grid-cols-2 gap-[16px] pb-4'>
          {directories!.map((art, index) => (
            <div
              className='relative flex aspect-square w-full flex-col justify-end rounded-[1.875rem]'
              key={index}
            >
              <img
                className='absolute left-0 top-0 h-full w-full rounded-[1.875rem] object-cover'
                src={art.image}
                alt={art.title}
              />
              <div className='relative z-[100] flex h-1/4 w-full items-center rounded-[0px_0px_1.875rem_1.875rem] bg-[rgba(0,0,0,0.50)] pl-8 backdrop-blur-[.4rem]'>
                <label className='pb-2 text-[1rem] font-medium text-white'>
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
