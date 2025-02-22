import OpenLinkButton from '@/components/buttons/open-link-button';
import PhotoWithBlur from '@/components/misc/photo-with-blur';
import Timestamp from '@/components/misc/timestamp';
import { IncludeBorder } from '@/components/rounded-borders/include-border';
import { RoundedBorder } from '@/components/rounded-borders/rounded-border';
import { RoundedTextBorder } from '@/components/rounded-borders/rounded-text-border';
import { ArticlePreview } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const LargeArticleCard = ({
  article,
  className = ''
}: {
  article: ArticlePreview;
  className?: string;
}) => {
  const { image, title, author, createdAt, id } = article;

  return (
    <Link
      href={`/article/${id}`}
      className={cn('group relative flex h-full grow', className)}
    >
      <PhotoWithBlur
        className='h-full w-full cursor-pointer rounded-[3rem] tablet:rounded-[2rem]'
        src={image}
        alt={title}
      />
      <div className='absolute right-8 top-8 flex flex-col items-end gap-8 px-3 py-1 tablet:right-3 tablet:top-3 tablet:gap-4'>
        <RoundedBorder
          className='flex flex-col items-end'
          paddingTop={4}
          paddingBottom={8}
          paddingLeft={12}
          paddingRight={12}
          borderRadius={16}
        >
          <RoundedTextBorder className='w-[450px] text-end text-3xl font-semibold text-black group-hover:underline tablet:w-[30vw] tablet:text-xl mobile:w-[80vw]'>
            {title}
          </RoundedTextBorder>
          <IncludeBorder>
            <label>{author}</label>
          </IncludeBorder>
        </RoundedBorder>
        <OpenLinkButton />
      </div>
      <Timestamp
        className='absolute bottom-8 right-8 laptop:bottom-3 laptop:right-3'
        time={createdAt as Date}
      />
    </Link>
  );
};

export default LargeArticleCard;
