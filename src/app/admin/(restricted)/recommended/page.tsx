import { getAllArticlesHighlights } from '@/api/admin/article';
import { getHighlightedArticles } from '@/api/article';
import HighlightedArticlesForm from '@/components/forms/highlighted-articles-form';

export default async function () {
  let currentHighlightedArticles = await getHighlightedArticles();
  let articles = await getAllArticlesHighlights();
  currentHighlightedArticles = currentHighlightedArticles.sort(
    (a, b) => a.highlightID - b.highlightID
  );

  return (
    <section
      className='section flex-col pb-4 pt-20 mobile:pb-2'
      id='recommended'
    >
      <span className='mb-8 px-8 text-4xl font-bold'>Articole recomandate</span>
      <HighlightedArticlesForm
        articles={currentHighlightedArticles}
        allArticles={articles}
      />
    </section>
  );
}
