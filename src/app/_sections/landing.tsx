import { getLatestArticleWithAncestor } from '@/api/article';
import Carousel from '@/app/_sections/landing/carousel';
import Link from 'next/link';

export default async function Landing() {
  const latestLiteratureArticle = await getLatestArticleWithAncestor([
    1, 3, 10
  ]);
  const latestMoviesArticle = await getLatestArticleWithAncestor([9]);

  return (
    <section className='section flex-col items-center pb-4 pt-[12rem] mobile:pt-20'>
      <Carousel
        literatureArticle={latestLiteratureArticle ?? null}
        moviesArticle={latestMoviesArticle ?? null}
      />
      <Link
        href='/#recommended'
        className='flex flex-col items-center justify-center pt-4'
      >
        <span className='font-medium'>Vezi articolele recomandate</span>
        <i className='fa fa-chevron-down my-[-0.35rem] text-xl' />
      </Link>
    </section>
  );
}
