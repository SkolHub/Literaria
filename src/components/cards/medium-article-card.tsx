import OpenLinkButton from '@/components/buttons/open-link-button';
import PhotoWithBlur from '@/components/misc/photo-with-blur';
import Timestamp from '@/components/misc/timestamp';
import SmallTitle from '@/components/typography/small-title';
import TitleLabel from '@/components/typography/title-label';
import { Article } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const MediumArticleCard = ({
  article,
  titleClassName
}: {
  article: Article;
  titleClassName?: string;
}) => {
  const { author, title, image, createdAt, id } = article;

  return (
    <Link href={`/article/${id}`}>
      <div className='flex h-full max-w-min flex-col'>
        <div className='relative h-full w-[40rem] overflow-hidden laptop:w-[30rem] mobile:w-[90vw]'>
          <PhotoWithBlur
            className='absolute inset-0 cursor-pointer rounded-[3rem] mobile:rounded-3xl'
            src={image}
            alt={title}
          />
          <Timestamp
            className='absolute bottom-[2.6rem] right-[2.6rem] mobile:bottom-4 mobile:right-4'
            time={createdAt}
          />
          <OpenLinkButton className='absolute right-[2.6rem] top-[2.6rem] mobile:right-4 mobile:top-4' />
        </div>
        <TitleLabel className='mt-4'>{author}</TitleLabel>
        <SmallTitle
          className={cn(
            'mt-4 line-clamp-3 h-32 min-h-32 laptop:h-24 laptop:min-h-24 mobile:mt-2',
            titleClassName
          )}
        >
          {title}
        </SmallTitle>
      </div>
    </Link>
  );
};

export default MediumArticleCard;
