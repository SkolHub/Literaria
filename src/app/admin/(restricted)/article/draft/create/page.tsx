import { getAllSidebarArticles } from '@/api/admin/article';
import DraftForm from '@/components/forms/draft-form';

export default async function () {
  const articles = await getAllSidebarArticles();

  return (
    <main className='flex grow flex-col items-center overflow-auto px-12 pb-20 pt-20'>
      <DraftForm articles={articles} />
    </main>
  );
}
