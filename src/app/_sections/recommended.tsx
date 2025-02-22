import { getHighlightedArticles } from '@/api/article';
import LargeArticleCard from '@/components/cards/large-article-card';
import SmallArticleCard from '@/components/cards/small-article-card';
import SpotlightCardMobile from '@/components/cards/spotlight-card-mobile';
import MainTitle from '@/components/typography/main-title';
import Link from 'next/link';
import { Vibrant } from 'node-vibrant/node';

export default async function () {
  const articles = await getHighlightedArticles();
  let color1: string = '#5b5a36';
  let color2: string = '#5b5a36';

  if (articles[0].Article.image) {
    try {
      const palette = await Vibrant.from(
        articles[0].Article.image
      ).getPalette();

      color1 = palette.Muted?.hex ?? '#5b5a36';
      color2 = palette.DarkVibrant?.hex ?? '#5b5a36';
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section
      className='section flex-col pb-4 pt-20 mobile:pb-2'
      id='recommended'
    >
      <MainTitle className='mb-8 text-center'>Articole recomandate</MainTitle>
      <div className='box-border flex w-full grow gap-[2%] overflow-hidden px-[2%] py-0 mobile:hidden'>
        <SmallArticleCard
          className='w-[30%] min-w-[30%]'
          article={articles[1].Article}
        />
        <LargeArticleCard article={articles[0].Article} />
        <SmallArticleCard
          className='w-[24%] min-w-[24%]'
          article={articles[2].Article}
        />
      </div>
      <div className='box-border hidden w-full grow flex-col gap-3 overflow-hidden px-4 py-0 mobile:flex'>
        <LargeArticleCard className='!h-0 grow' article={articles[0].Article} />
        <div className='flex max-h-[150px] gap-3'>
          <SpotlightCardMobile
            className='w-0 grow'
            article={articles[1].Article}
            style={{
              backgroundColor: color1
            }}
          />
          <SpotlightCardMobile
            className='w-0 grow'
            article={articles[2].Article}
            style={{
              backgroundColor: color2
            }}
          />
        </div>
      </div>
      <Link
        href='/#latest'
        className='flex flex-col items-center justify-center pt-4'
      >
        <span className='font-medium'>Vezi cele mai noi articole</span>
        <i className='fa fa-chevron-down my-[-0.35rem] text-xl' />
      </Link>
    </section>
  );
}
