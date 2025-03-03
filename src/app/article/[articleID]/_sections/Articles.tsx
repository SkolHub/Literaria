import { Article } from '@/lib/models';
import ArticleList from '@/components/ArticleList';
import MediumArticleCard from '@/components/cards/MediumArticleCard';
import dateFormatter from '@/lib/formatters/dateFormatter';
import Link from 'next/link';

export default ({ article }: { article: Article }) => {
  const articles = article.children?.filter(
    (art) => art.children?.length === 0
  );

  if (!articles?.length) {
    return '';
  }

  return (
    <section
      id='articles'
      className='section !h-auto !min-h-[100svh] flex-col pb-4 pt-20'
    >
      <h1 className='main-title mb-8 pl-8 text-left laptop:pl-5'>Articole</h1>
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
            <img
              className='h-[8rem] w-[44%] min-w-[44%] max-w-[44%] rounded-[1.25rem] object-cover'
              src={article.image}
              alt={article.title}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};
