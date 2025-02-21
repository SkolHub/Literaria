import OpenLinkButton from '@/components/buttons/open-link-button';
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
  const { author, title, image, id } = article;

  return (
    <Link href={`/article/${id}`} className={`flex flex-col ${className}`}>
      <div className='relative flex h-0 grow'>
        <img
          className='h-auto w-full cursor-pointer rounded-[3rem] object-cover'
          src={image}
          alt={title}
        />
        <OpenLinkButton className='absolute right-8 top-8' />
      </div>
      <div className='flex flex-col'>
        <TitleLabel>{author}</TitleLabel>
        <SmallTitle className='mx-0 mb-0 mt-4'>{title}</SmallTitle>
      </div>
    </Link>
  );
}
