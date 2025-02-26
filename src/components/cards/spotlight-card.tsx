import OpenLinkButton from '@/components/buttons/open-link-button';
import SmallTitle from '@/components/typography/small-title';
import { dateFormatter } from '@/lib/formatters/date-formatter';
import { Article } from '@/lib/types';
import { cn } from '@/lib/utils';

const SpotlightCard = ({
  article,
  className = '',
  style
}: {
  article: Article;
  style?: React.CSSProperties;
  className?: string;
}) => {
  const { title, author, createdAt } = article;

  return (
    <div
      className={cn(
        'group flex flex-col justify-around rounded-[3rem] p-14 laptop:p-10 tablet:rounded-[2rem] tablet:p-8',
        className
      )}
      style={style}
    >
      <div className='flex flex-col'>
        <SmallTitle className='m-0 text-white group-hover:underline'>
          {title}
        </SmallTitle>
        <span className='mx-0 mb-4 pt-4 text-xl font-medium text-[white]'>
          {author}
        </span>
      </div>
      <div className='flex items-center justify-between gap-4'>
        <label className='mt-[1%] text-base font-medium text-[white]'>
          {dateFormatter(new Date(createdAt))}
        </label>
        <OpenLinkButton />
      </div>
    </div>
  );
};

export default SpotlightCard;
