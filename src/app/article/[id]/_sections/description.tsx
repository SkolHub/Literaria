import NextSectionCard from '@/components/cards/next-section-card';
import PhotoWithBlur from '@/components/misc/photo-with-blur';
import MainTitle from '@/components/typography/main-title';
import { Article } from '@/lib/types';

export default function ({ article }: { article: Article }) {
  if (!article.content) {
    return '';
  }

  return (
    <section className='section !h-auto !min-h-[100svh] gap-8 px-8 pb-10 pt-32 tablet:gap-7 mobile:flex-col mobile:gap-3 mobile:px-4 mobile:pt-[5rem]'>
      <div className='flex grow flex-col'>
        <MainTitle className='mb-28 text-left mobile:mb-8'>
          {article.title}
        </MainTitle>
        <div
          className='pr-[10rem] text-lg mobile:pr-0'
          dangerouslySetInnerHTML={{
            __html: (article.content as any).content
          }}
        />
      </div>
      <div className='h-100% flex min-w-[30%] max-w-[30%] flex-col gap-10 tablet:gap-6 mobile:max-w-none mobile:flex-row mobile:gap-3'>
        <PhotoWithBlur
          className='max-h-[70%] rounded-[3rem] tablet:rounded-[2rem]'
          src={article.image}
          alt='Directory description'
        />
        {article.children[0].children.length > 0 ? (
          <NextSectionCard
            className='tablet:hidden'
            text={'Vezi autorii'}
            image={article.image}
            anchorScroll={'#authors'}
          />
        ) : (
          <NextSectionCard
            text={'Vezi articolele'}
            image={article.image}
            className='tablet:hidden'
            anchorScroll='#articles'
          />
        )}
      </div>
    </section>
  );
}
