import { getAllSidebarArticles } from '@/api/admin/article';
import { getArticleByTitleID } from '@/api/article';
import ArticleForm from '@/components/forms/article-form';
import SmallTitle from '@/components/typography/small-title';

export default async function ({
  params
}: {
  params: Promise<{
    title: string;
  }>;
}) {
  const articles = await getAllSidebarArticles();

  const { title } = await params;

  const article = await getArticleByTitleID(title);

  if (!article) {
    return (
      <main className='flex grow items-center justify-center'>
        <SmallTitle>Articolul nu a fost găsit</SmallTitle>
      </main>
    );
  }

  return (
    <main className='flex grow flex-col items-center overflow-auto px-12 pb-20 pt-20'>
      <ArticleForm
        articles={articles}
        parentID={article.parent?.id}
        id={article.id}
        title={article.title}
        imageUrl={article.image}
        content={article.content.content}
        author={article.author}
      />
    </main>
  );
}
