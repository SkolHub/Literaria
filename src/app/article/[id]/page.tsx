import { getArticleByID } from '@/api/article';
import Article from '@/app/article/[id]/_sections/article';
import Articles from '@/app/article/[id]/_sections/articles';
import Description from '@/app/article/[id]/_sections/description';
import Directories from '@/app/article/[id]/_sections/directories';
import Landing from '@/app/article/[id]/_sections/landing';
import { Article as ArticleModel } from '@/lib/types';

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // const article = (await getArticleByID(+id)) as unknown as ArticleModel;

  return {
    title: `${id}` + ' | Literaria',
    description: 'Literaria'
  };
}

export default async function ({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <>{id}</>;

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
