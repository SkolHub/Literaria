import OpenLinkButton from '@/components/buttons/open-link-button';
import { IncludeBorder } from '@/components/rounded-borders/include-border';
import { RoundedBorder } from '@/components/rounded-borders/rounded-border';
import { RoundedTextBorder } from '@/components/rounded-borders/rounded-text-border';
import { Article } from '@/lib/types';
import Link from 'next/link';

export default function SliderArticles({
  literatureArticle,
  moviesArticle,
  currentSlide
}: {
  literatureArticle: Article;
  moviesArticle: Article;
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
  literatureArticle: Article;
  moviesArticle: Article;
  currentSlide: number;
}) {
  if (currentSlide === 2) return null;

  return (
    <Link
      href={
        '/article/' +
        (currentSlide === 0 ? literatureArticle.titleID : moviesArticle.titleID)
      }
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
          {currentSlide === 0 ? literatureArticle.title : moviesArticle.title}
        </RoundedTextBorder>
        <IncludeBorder>
          <label>
            {currentSlide === 0
              ? literatureArticle.author
              : moviesArticle.author}
          </label>
        </IncludeBorder>
      </RoundedBorder>
      <OpenLinkButton className='ml-[-12px]' />
    </Link>
  );
}
