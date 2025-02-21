import OpenLinkButton from '@/components/buttons/open-link-button';
import Timestamp from '@/components/misc/timestamp';
import SmallTitle from '@/components/typography/small-title';
import TitleLabel from '@/components/typography/title-label';
import { Article } from '@/lib/types';
import Link from 'next/link';

const MediumArticleCard = ({ article }: { article: Article }) => {
  const { author, title, image, createdAt, id } = article;

  return (
    <Link href={`/article/${id}`}>
      <div className='flex h-full max-w-min flex-col'>
        <div className='relative flex w-[40rem] grow laptop:w-[30rem] mobile:w-[90vw]'>
          <img
            className='h-[30rem] w-[40rem] cursor-pointer rounded-[3rem] object-cover laptop:h-[20rem] laptop:w-[30rem] tablet:h-[16rem] mobile:h-[55dvh] mobile:w-[90vw]'
            src={image}
            alt={title}
          />
          <Timestamp
            className='absolute bottom-[2.6rem] right-[2.6rem] mobile:bottom-auto mobile:top-[calc(55dvh-3.6rem)]'
            time={createdAt}
          />
          <OpenLinkButton className='absolute right-[2.6rem] top-[2.6rem]' />
        </div>
        <TitleLabel className='mt-3'>{author}</TitleLabel>
        <SmallTitle className='mt-4 line-clamp-2'>{title}</SmallTitle>
      </div>
    </Link>
  );
};

export default MediumArticleCard;
