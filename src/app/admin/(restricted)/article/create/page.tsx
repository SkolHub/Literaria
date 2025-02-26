import ArticleForm from '@/components/forms/article-form';
import { getAllSidebarArticles } from '@/api/admin/article';

export default async function () {
  const articles = await getAllSidebarArticles();

  return (
    <main className='flex grow flex-col items-center overflow-auto px-12 pb-20 pt-20'>
      <ArticleForm articles={articles} />
    </main>
  );
}
