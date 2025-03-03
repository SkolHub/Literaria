import { getAllSidebarArticles } from '@/api/admin/article';
import { getDraftByID } from '@/api/admin/draft';
import SmallTitle from '@/components/typography/small-title';
import DraftForm from '@/components/forms/draft-form';

export default async function ({
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const articles = await getAllSidebarArticles();

  const { id } = await params;

  const article = await getDraftByID(+id);

  if (!article) {
    return (
      <main className='flex grow items-center justify-center'>
        <SmallTitle>Draftul nu a fost găsit</SmallTitle>
      </main>
    );
  }

  return (
    <main className='flex grow flex-col items-center overflow-auto px-12 pb-20 pt-20'>
      <DraftForm
        articles={articles}
        parentID={article.parentID ?? undefined}
        id={article.id}
        title={article.title}
        imageUrl={article.image}
        content={article.content}
        author={article.author}
      />
    </main>
  );
}
