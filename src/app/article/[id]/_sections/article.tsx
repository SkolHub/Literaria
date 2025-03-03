import MediumArticleCard from '@/components/cards/medium-article-card';
import MarkdownRenderer from '@/components/markdown/markdown-renderer';
import ArticleList from '@/components/misc/article-list';
import BackButton from '@/components/misc/back-button';
import PhotoWithBlur from '@/components/misc/photo-with-blur';
import Timestamp from '@/components/misc/timestamp';
import { IncludeBorder } from '@/components/rounded-borders/include-border';
import { RoundedBorder } from '@/components/rounded-borders/rounded-border';
import { RoundedTextBorder } from '@/components/rounded-borders/rounded-text-border';
import SmallTitle from '@/components/typography/small-title';
import { Article } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ({ article }: { article: Article }) {
  return (
    <>
      <section className='px-[9rem] pt-32 mobile:px-4 mobile:pt-20'>
        <BackButton className='pb-4' />
        <div className='relative mb-4'>
          <PhotoWithBlur
            className='h-[70vh] w-full rounded-[3rem] mobile:h-[50vh]'
            src={article.image}
            alt={article.title}
          />
          <div className='absolute -bottom-2 flex w-full flex-col items-center gap-8 px-3 py-1'>
            <RoundedBorder
              className='flex flex-col items-center'
              paddingTop={4}
              paddingBottom={8}
              paddingLeft={12}
              paddingRight={12}
              borderRadius={16}
            >
              <RoundedTextBorder className='w-[450px] text-pretty text-center text-3xl font-semibold text-black mobile:w-[80vw] mobile:text-xl'>
                {article.title}
              </RoundedTextBorder>
              <IncludeBorder>
                <label className='py-2.5 mobile:text-sm'>
                  {article.author}
                </label>
              </IncludeBorder>
              <IncludeBorder>
                <div className='h-0 w-80' />
              </IncludeBorder>
            </RoundedBorder>
          </div>
          <Timestamp
            className='absolute bottom-12 right-12 mobile:bottom-auto mobile:right-6 mobile:top-6'
            time={article.createdAt}
          />
        </div>
        {(article as any).parentChain
          .reverse()
          .map((parent: any, index: any, array: any) => (
            <Link
              href={`/article/${parent.id}`}
              key={index}
              className={cn(
                'mb-16 text-lg font-medium mobile:text-base',
                index === array.length - 1 ? 'font-bold' : ''
              )}
            >
              <span className='hover:underline'>{parent.title}</span>
              {index !== array.length - 1 ? ' / ' : ''}
            </Link>
          ))}
        <article className='py-12 mobile:pt-4'>
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
          <ArticleList className='!h-[32rem] mobile:!h-[20rem]'>
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
          <ArticleList className='!h-[32rem] mobile:!h-[20rem]'>
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
