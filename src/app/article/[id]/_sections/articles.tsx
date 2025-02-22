import MediumArticleCard from '@/components/cards/medium-article-card';
import ArticleList from '@/components/misc/article-list';
import MainTitle from '@/components/typography/main-title';
import { dateFormatter } from '@/lib/formatters/date-formatter';
import { Article } from '@/lib/types';
import Link from 'next/link';
import PhotoWithBlur from '@/components/misc/photo-with-blur';

export default function ({ article }: { article: Article }) {
  const articles = article.children?.filter(
    (art) => art.children?.length === 0
  );

  if (!articles?.length) {
    return null;
  }

  return (
    <section
      id='articles'
      className='section relative flex-col pb-4 pt-20 mobile:!h-auto mobile:!min-h-dvh'
    >
      <MainTitle className='mb-8 pl-8 text-left laptop:pl-5'>
        Articole
      </MainTitle>
      <ArticleList className='mobile:hidden'>
        {articles.map((article, index) => (
          <MediumArticleCard article={article} key={index} />
        ))}
      </ArticleList>
      <div className='hidden flex-col gap-4 px-4 mobile:flex'>
        {articles.map((article, index) => (
          <Link
            href={`/article/${article.id}`}
            className='flex justify-between gap-6'
            key={index}
          >
            <div className='flex flex-col justify-between'>
              <h1 className='line-clamp-3 text-[1.15rem] font-semibold'>
                {article.title}
              </h1>
              <div className='flex flex-col'>
                <label className='text-[.9rem] font-medium'>
                  {article.author}
                </label>
                <label className='text-[.9rem] font-medium'>
                  {dateFormatter(new Date(article.createdAt))}
                </label>
              </div>
            </div>
            <PhotoWithBlur
              className='h-[8rem] w-[44%] min-w-[44%] max-w-[44%] rounded-[1.25rem]'
              src={article.image}
              alt={article.title}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
