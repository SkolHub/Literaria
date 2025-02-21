import SmallArticleCard from '@/components/cards/SmallArticleCard';
import LargeArticleCard from '@/components/cards/LargeArticleCard';
import SpotlightCardMobile from '@/components/cards/SpotlightCardMobile';
import { getRecommended } from '@/lib/api/article';

export default async () => {
  const articles = await getRecommended();

  return (
    <section className='section flex-col pb-24 pt-20 laptop:pb-16 mobile:pb-8'>
      <h1 className='main-title mb-8 text-center'>Articole recomandate</h1>
      <div className='box-border flex w-full grow gap-[2%] overflow-hidden px-[2%] py-0 mobile:hidden'>
        <SmallArticleCard
          className='w-[30%] min-w-[30%]'
          article={articles[1].Article as any}
        />
        <LargeArticleCard article={articles[0].Article as any} />
        <SmallArticleCard
          className='w-[24%] min-w-[24%]'
          article={articles[2].Article as any}
        />
      </div>
      <div className='box-border hidden w-full grow flex-col gap-3 overflow-hidden px-4 py-0 mobile:flex'>
        <LargeArticleCard className='!h-0 grow' article={articles[0].Article as any} />
        <div className='flex max-h-[150px] gap-3'>
          <SpotlightCardMobile
            className='w-0 grow'
            article={articles[1].Article as any}
          />
          <SpotlightCardMobile
            className='w-0 grow'
            article={articles[2].Article as any}
          />
        </div>
      </div>
    </section>
  );
};
