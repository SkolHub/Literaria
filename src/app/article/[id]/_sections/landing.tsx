import GiantArticleCard from '@/components/cards/giant-article-card';
import NextSectionCard from '@/components/cards/next-section-card';
import NextSectionCardMobile from '@/components/cards/next-section-card-mobile';
import SpotlightCard from '@/components/cards/spotlight-card';
import SpotlightCardMobile from '@/components/cards/spotlight-card-mobile';
import MainTitle from '@/components/typography/main-title';
import { articleCountFormatter } from '@/lib/formatters/article-count-formatter';
import { Article } from '@/lib/types';
import Link from 'next/link';
import { Vibrant } from 'node-vibrant/node';
import BackButton from '@/components/misc/back-button';

export default async function ({ article }: { article: Article }) {
  let color: string = '#5b5a36';

  if (article.children[article.children.length - 1].image) {
    try {
      color = await Vibrant.from(
        article.children[article.children.length - 1].image
      )
        .getPalette()
        .then((palette) => palette.Muted?.hex ?? '#5b5a36');
      console.log(color);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className='section gap-12 px-8 pb-10 pt-32 tablet:gap-7 mobile:flex-col mobile:gap-3 mobile:px-4 mobile:pt-[5rem]'>
      <BackButton />
      <div className='flex grow flex-col'>
        <MainTitle className='mb-8 text-left tablet:mb-6'>
          {article.title}
        </MainTitle>
        <GiantArticleCard
          article={article.children[article.children.length - 1]}
        />
      </div>
      <div className='flex min-w-[30%] max-w-[30%] flex-col gap-10 tablet:gap-6 mobile:max-w-none mobile:flex-row mobile:gap-3'>
        <div className='flex max-h-[150px] gap-3'>
          {article.children[article.children.length - 2] && (
            <SpotlightCardMobile
              className='hidden w-1/2 mobile:flex'
              article={article.children[article.children.length - 2]}
            />
          )}
          <NextSectionCardMobile
            className='hidden w-1/2 mobile:flex'
            text={articleCountFormatter(article.children.length)}
            image={article.image}
            anchorScroll={'#articles'}
          />
        </div>
        {article.children[article.children.length - 2] && (
          <Link
            className='flex min-h-[40%] tablet:grow mobile:hidden'
            href={
              '/article/' + article.children[article.children.length - 2].id
            }
          >
            <SpotlightCard
              className={`grow`}
              article={article.children[article.children.length - 2]}
              style={{
                backgroundColor: color
              }}
            />
          </Link>
        )}
        <NextSectionCard
          className='tablet:hidden'
          text={articleCountFormatter(article.children.length)}
          image={article.children[0].image}
          anchorScroll={'#articles'}
        />
      </div>
    </section>
  );
}
