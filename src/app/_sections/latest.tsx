import { getLatestArticles } from '@/api/article';
import MediumArticleCard from '@/components/cards/medium-article-card';
import ArticleList from '@/components/misc/article-list';
import MainTitle from '@/components/typography/main-title';

export default async function () {
  const articles = await getLatestArticles();

  return (
    <section className='section flex-col pt-20 mobile:h-[100dvh]'>
      <MainTitle className='mb-8 pl-8 text-left laptop:pl-5'>
        Ultimele articole
      </MainTitle>
      <ArticleList className='mobile:h-full'>
        {articles.map((article, index) => (
          <MediumArticleCard article={article as any} key={index} />
        ))}
      </ArticleList>
    </section>
  );
}
