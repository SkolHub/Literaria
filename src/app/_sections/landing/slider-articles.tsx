import OpenLinkButton from '@/components/buttons/open-link-button';
import { IncludeBorder } from '@/components/rounded-borders/include-border';
import { RoundedBorder } from '@/components/rounded-borders/rounded-border';
import { RoundedTextBorder } from '@/components/rounded-borders/rounded-text-border';
import { ArticlePreview } from '@/lib/types';
import Link from 'next/link';

export default function SliderArticles({
  literatureArticle,
  moviesArticle,
  currentSlide
}: {
  literatureArticle: ArticlePreview | null;
  moviesArticle: ArticlePreview | null;
  currentSlide: number;
}) {
  return (
    <>
      <SliderArticle
        literatureArticle={literatureArticle}
        moviesArticle={moviesArticle}
        currentSlide={currentSlide}
      />
      {currentSlide === 2 && (
        <Link
          href={'/gallery'}
          className='group absolute left-[4.4rem] top-[11rem] flex flex-col items-start gap-6 px-3 py-1 mobile:left-[1.5rem] mobile:top-[6.5rem] mobile:gap-5'
        >
          <RoundedBorder
            className='flex flex-col items-start'
            paddingTop={8}
            paddingBottom={8}
            paddingLeft={12}
            paddingRight={12}
            borderRadius={16}
          >
            <RoundedTextBorder className='flex w-[450px] text-pretty text-2xl font-semibold text-black group-hover:underline mobile:w-[80vw] mobile:text-xl'>
              Mergi la galerie
            </RoundedTextBorder>
          </RoundedBorder>
          <OpenLinkButton className='ml-[-12px]' />
        </Link>
      )}
    </>
  );
}

function SliderArticle({
  literatureArticle,
  moviesArticle,
  currentSlide
}: {
  literatureArticle: ArticlePreview | null;
  moviesArticle: ArticlePreview | null;
  currentSlide: number;
}) {
  if (currentSlide === 2) return null;

  const article = currentSlide === 0 ? literatureArticle : moviesArticle;

  if (!article) return null;

  return (
    <Link
      href={`/article/${article.titleID}`}
      className='group absolute left-[4.4rem] top-[11rem] flex flex-col items-start gap-6 px-3 py-1 mobile:left-[1.5rem] mobile:top-[6.5rem] mobile:gap-5'
    >
      <RoundedBorder
        className='flex flex-col items-start'
        paddingTop={8}
        paddingBottom={8}
        paddingLeft={12}
        paddingRight={12}
        borderRadius={16}
      >
        <IncludeBorder>
          <div className='flex items-center gap-1.5'>
            <i className='fa fa-clock-rotate-left' />
            <span className='font-semibold'>
              {currentSlide === 0
                ? 'Ultimul articol din literatură'
                : 'Ultima recenzie de film'}
            </span>
          </div>
        </IncludeBorder>
        <RoundedTextBorder className='w-[450px] text-pretty text-3xl font-semibold text-black group-hover:underline laptop:w-[30vw] mobile:w-[70vw] mobile:text-xl'>
          {article.title}
        </RoundedTextBorder>
        <IncludeBorder>
          <label>{article.author}</label>
        </IncludeBorder>
      </RoundedBorder>
      <OpenLinkButton className='ml-[-12px]' />
    </Link>
  );
}
