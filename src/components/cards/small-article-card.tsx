import OpenLinkButton from '@/components/buttons/open-link-button';
import PhotoWithBlur from '@/components/misc/photo-with-blur';
import Timestamp from '@/components/misc/timestamp';
import SmallTitle from '@/components/typography/small-title';
import TitleLabel from '@/components/typography/title-label';
import { ArticlePreview } from '@/lib/types';
import Link from 'next/link';

export default function ({
  article,
  className = ''
}: {
  article: ArticlePreview;
  className?: string;
}) {
  const { author, createdAt, title, image, id } = article;

  return (
    <Link
      href={`/article/${id}`}
      className={`group flex flex-col ${className}`}
    >
      <div className='relative flex h-0 grow'>
        <PhotoWithBlur
          className='h-auto w-full cursor-pointer rounded-[3rem] tablet:rounded-[2rem]'
          src={image}
          alt={title}
        />
        <OpenLinkButton className='absolute right-8 top-8' />
        <Timestamp
          className='absolute bottom-8 right-8 tablet:bottom-3 tablet:right-3'
          time={createdAt}
        />
      </div>
      <div className='mt-4 flex flex-col'>
        <TitleLabel>{author}</TitleLabel>
        <SmallTitle className='group-hover:underline'>
          {title}
        </SmallTitle>
      </div>
    </Link>
  );
}
