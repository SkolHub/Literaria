import { getArticleByID } from '@/api/article';
import Article from '@/app/article/[id]/_sections/Article';
import Articles from '@/app/article/[id]/_sections/Articles';
import Description from '@/app/article/[id]/_sections/Description';
import Directories from '@/app/article/[id]/_sections/Directories';
import Landing from '@/app/article/[id]/_sections/Landing';
import { Article as ArticleModel } from '@/lib/types';

export default async function ({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const article = (await getArticleByID(+id)) as unknown as ArticleModel;

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
}
