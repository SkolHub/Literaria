import MediumArticleCard from '@/components/cards/MediumArticleCard';
import ArticleList from '@/components/ArticleList';
import { getLatest } from '@/lib/api/article';

export default async () => {
  const articles = await getLatest();

  return (
    <section className='section flex-col pt-20 mobile:h-[100dvh]'>
      <h1 className='main-title mb-8 pl-8 text-left laptop:pl-5'>
        Ultimele articole
      </h1>
      <ArticleList className='mobile:h-full'>
        {articles.map((article, index) => (
          <MediumArticleCard article={article as any} key={index} />
        ))}
      </ArticleList>
    </section>
  );
};
