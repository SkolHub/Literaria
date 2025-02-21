import GiantArticleCard from '@/components/cards/giant-article-card';
import NextSectionCard from '@/components/cards/next-section-card';
import NextSectionCardMobile from '@/components/cards/next-section-card-mobile';
import SpotlightCard from '@/components/cards/spotlight-card';
import SpotlightCardMobile from '@/components/cards/spotlight-card-mobile';
import MainTitle from '@/components/typography/main-title';
import { articleCountFormatter } from '@/lib/formatters/article-count-formatter';
import { Article } from '@/lib/types';
import Link from 'next/link';

export default function ({ article }: { article: Article }) {
  return (
    <section className='section gap-12 px-8 pb-10 pt-32 tablet:gap-7 mobile:flex-col mobile:gap-3 mobile:px-4 mobile:pt-[5rem]'>
      <div className='flex grow flex-col'>
        <MainTitle className='mb-8 text-left'>{article.title}</MainTitle>
        <GiantArticleCard article={article} />
      </div>
      <div className='flex min-w-[30%] max-w-[30%] flex-col gap-10 tablet:gap-6 mobile:max-w-none mobile:flex-row mobile:gap-3'>
        <div className='flex max-h-[150px] gap-3'>
          <SpotlightCardMobile
            className='hidden w-1/2 mobile:flex'
            article={article.children[0]}
          />
          <NextSectionCardMobile
            className='hidden w-1/2 mobile:flex'
            text={articleCountFormatter(article.children.length)}
            image={article.children[0].image}
            anchorScroll={'#articles'}
          />
        </div>
        <Link
          className='flex min-h-[40%] tablet:grow mobile:hidden'
          href={'/article/' + article.children[0].id}
        >
          <SpotlightCard className='grow' article={article.children[0]} />
        </Link>
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
