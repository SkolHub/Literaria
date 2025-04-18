import { getArticleByTitleID, getTitleIDByLegacyID } from '@/api/article';
import Article from '@/app/article/[title]/_sections/article';
import Articles from '@/app/article/[title]/_sections/articles';
import Description from '@/app/article/[title]/_sections/description';
import Directories from '@/app/article/[title]/_sections/directories';
import Landing from '@/app/article/[title]/_sections/landing';
import { Article as ArticleModel } from '@/lib/types';
import NotFound from 'next/dist/client/components/not-found-error';
import { permanentRedirect } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;

  const article = (await getArticleByTitleID(title)) as unknown as ArticleModel;

  return {
    title: (article?.title ?? 'Not found') + ' | Literaria',
    description: 'Literaria'
  };
}

export default async function ({
  params
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;

  if (title.match(/^[0-9]+$/)) {
    const titleID = await getTitleIDByLegacyID(+title);
    permanentRedirect(`/article/${titleID}`);
  }

  const article = (await getArticleByTitleID(title)) as unknown as ArticleModel;

  if (!article) {
    return <NotFound />;
  }

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
