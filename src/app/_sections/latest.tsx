import { getLatestArticles } from '@/api/article';
import MediumArticleCard from '@/components/cards/medium-article-card';
import ArticleList from '@/components/misc/article-list';
import MainTitle from '@/components/typography/main-title';

export default async function () {
  const articles = await getLatestArticles();

  return (
    <section className='section relative flex-col pt-20' id='latest'>
      <MainTitle className='mb-8 pl-8 text-left laptop:pl-5'>
        Ultimele articole
      </MainTitle>
      <ArticleList className='pb-8 mobile:pb-4'>
        {articles.map((article, index) => (
          <MediumArticleCard article={article as any} key={index} />
        ))}
      </ArticleList>
    </section>
  );
}
