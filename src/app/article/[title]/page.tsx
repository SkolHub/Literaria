import { getArticleByID } from '@/api/article';
import Article from '@/app/article/[title]/_sections/article';
import Articles from '@/app/article/[title]/_sections/articles';
import Description from '@/app/article/[title]/_sections/description';
import Directories from '@/app/article/[title]/_sections/directories';
import Landing from '@/app/article/[title]/_sections/landing';
import { Article as ArticleModel } from '@/lib/types';

export async function generateMetadata({
  params
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;

  const article = (await getArticleByID(title)) as unknown as ArticleModel;

  return {
    title: article.title + ' | Literaria',
    description: 'Literaria'
  };
}

export default async function ({
  params
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;

  const article = (await getArticleByID(title)) as unknown as ArticleModel;

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
