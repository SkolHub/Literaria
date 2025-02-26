import { getAllSidebarArticles } from '@/api/admin/article';
import { getArticleByID } from '@/api/article';
import ArticleForm from '@/components/forms/article-form';
import SmallTitle from '@/components/typography/small-title';

export default async function ({
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const articles = await getAllSidebarArticles();

  const { id } = await params;

  const article = await getArticleByID(+id);

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
