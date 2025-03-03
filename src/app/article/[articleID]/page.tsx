import Landing from '@/app/article/[articleID]/_sections/Landing';
import Description from '@/app/article/[articleID]/_sections/Description';
import Directories from '@/app/article/[articleID]/_sections/Directories';
import Articles from '@/app/article/[articleID]/_sections/Articles';
import Article from '@/app/article/[articleID]/_sections/Article';
import { getArticleId } from '@/lib/api/article';
import { Article as ArticleModel } from '@/lib/models';

export default async ({ params }: { params: { articleID: string } }) => {
  const article = (await getArticleId(
    +params.articleID
  )) as any as ArticleModel;

  if (article.children.length === 0) {
    return <Article article={article} />;
  }

  return (
    <>
      <Landing article={article} />
      <Description article={article} />
      <Directories article={article} />
      <Articles article={article} />
    </>
  );
};
