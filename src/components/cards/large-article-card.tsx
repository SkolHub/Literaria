import OpenLinkButton from '@/components/buttons/open-link-button';
import Timestamp from '@/components/misc/timestamp';
import { ArticlePreview } from '@/lib/types';
import Link from 'next/link';

const LargeArticleCard = ({
  article,
  className = ''
}: {
  article: ArticlePreview;
  className?: string;
}) => {
  const { image, title, createdAt, id } = article;

  return (
    <Link
      href={`/article/${id}`}
      className={`relative flex h-full grow ${className}`}
    >
      <img
        className='h-full w-full cursor-pointer rounded-[3rem] object-cover'
        src={image}
        alt={title}
      />
      <Timestamp
        className='absolute bottom-8 right-8'
        time={createdAt as Date}
      />
      <OpenLinkButton className='absolute right-8 top-8' />
    </Link>
  );
};

export default LargeArticleCard;
