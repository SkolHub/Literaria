import LeafArticleHero from '@/app/article/[title]/_sections/leaf-article-hero';
import MediumArticleCard from '@/components/cards/medium-article-card';
import MarkdownRenderer from '@/components/markdown/markdown-renderer';
import ArticleList from '@/components/misc/article-list';
import Timestamp from '@/components/misc/timestamp';
import SmallTitle from '@/components/typography/small-title';
import { Article } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ({ article }: { article: Article }) {
  return (
    <>
      <style>{`
        :root {
          --literaria-article-nav-rgb: 30, 30, 30;
          --literaria-article-nav-foreground-rgb: 255, 255, 255;
          --literaria-article-nav-logo-filter: brightness(0) invert(1);
          --literaria-article-nav-search-bg-rgb: 255, 255, 255;
          --literaria-article-nav-search-fg-rgb: 0, 0, 0;
          --literaria-article-nav-gradient-opacity: 1;
          --literaria-article-nav-solid-opacity: 0;
        }
      `}</style>
      <LeafArticleHero
        title={article.title}
        author={article.author}
        image={article.image}
        createdAt={article.createdAt}
        backPath={
          article.parent?.titleID ? `/article/${article.parent.titleID}` : '/'
        }
      />
      <section className='px-[9rem] pb-4 mobile:px-4'>
        <article
          className='pb-12 pt-2 mobile:max-w-none mobile:pt-4'
          style={{
            maxWidth: '75ch',
            margin: '0 auto'
          }}
        >
          <div className='mb-8 flex items-start justify-between gap-x-6 gap-y-3'>
            <div className='flex flex-wrap items-center gap-1'>
              {(article as any).parentChain
                .reverse()
                .map((parent: any, index: any, array: any) => (
                  <Link
                    href={`/article/${parent.title_id}`}
                    key={index}
                    className={cn(
                      'text-lg font-medium mobile:text-base',
                      index === array.length - 1 ? 'font-bold' : ''
                    )}
                  >
                    <span className='hover:underline'>{parent.title}</span>
                    {index !== array.length - 1 ? ' /' : ''}
                  </Link>
                ))}
            </div>
            <Timestamp time={article.createdAt} />
          </div>
          <MarkdownRenderer>
            {(article.content as any)?.content ?? ''}
          </MarkdownRenderer>
        </article>
      </section>
      {/*@ts-ignore*/}
      {article.siblings.length > 0 && (
        <section className='relative mx-[8rem] flex flex-col pt-10 mobile:mx-0'>
          <SmallTitle className='mb-8 px-8 text-left text-4xl font-bold italic laptop:px-5 laptop:text-3xl'>
            {/*@ts-ignore*/}
            Alte articole din {article.parent?.title}
          </SmallTitle>
          <ArticleList
            className='!h-[32rem] mobile:!h-[20rem]'
            // @ts-ignore
            articleCount={article.siblings.length}
          >
            {/*@ts-ignore*/}
            {article.siblings.map((sibling, index) => (
              <MediumArticleCard
                article={sibling}
                key={index}
                titleClassName='mobile:text-xl text-2xl'
              />
            ))}
          </ArticleList>
        </section>
      )}
      {/*@ts-ignore*/}
      {article.authorOtherArticles.length > 0 && (
        <section className='relative mx-[8rem] flex flex-col mobile:mx-0 mobile:pt-0'>
          <SmallTitle className='mb-8 px-8 text-left text-4xl font-bold italic laptop:px-5 laptop:text-3xl'>
            Alte articole scrise de {article.author}
          </SmallTitle>
          <ArticleList
            className='!h-[32rem] mobile:!h-[20rem]'
            // @ts-ignore
            articleCount={article.authorOtherArticles.length}
          >
            {/*@ts-ignore*/}
            {article.authorOtherArticles.map((sibling, index) => (
              <MediumArticleCard
                article={sibling}
                key={index}
                titleClassName='mobile:text-xl text-2xl'
              />
            ))}
          </ArticleList>
        </section>
      )}
    </>
  );
}
