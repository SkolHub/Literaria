import { getHighlightedArticles } from '@/api/article';
import LargeArticleCard from '@/components/cards/large-article-card';
import SmallArticleCard from '@/components/cards/small-article-card';
import SpotlightCardMobile from '@/components/cards/spotlight-card-mobile';
import MainTitle from '@/components/typography/main-title';

export default async function () {
  const articles = await getHighlightedArticles();

  return (
    <section className='section flex-col pb-24 pt-20 laptop:pb-16 mobile:pb-8'>
      <MainTitle className='mb-8 text-center'>Articole recomandate</MainTitle>
      <div className='box-border flex w-full grow gap-[2%] overflow-hidden px-[2%] py-0 mobile:hidden'>
        <SmallArticleCard
          className='w-[30%] min-w-[30%]'
          article={articles[1]}
        />
        <LargeArticleCard article={articles[0]} />
        <SmallArticleCard
          className='w-[24%] min-w-[24%]'
          article={articles[2]}
        />
      </div>
      <div className='box-border hidden w-full grow flex-col gap-3 overflow-hidden px-4 py-0 mobile:flex'>
        <LargeArticleCard className='!h-0 grow' article={articles[0]} />
        <div className='flex max-h-[150px] gap-3'>
          <SpotlightCardMobile className='w-0 grow' article={articles[1]} />
          <SpotlightCardMobile className='w-0 grow' article={articles[2]} />
        </div>
      </div>
    </section>
  );
}
