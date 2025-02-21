import OpenLinkButton from '@/components/buttons/open-link-button';
import Timestamp from '@/components/misc/timestamp';
import { Article } from '@/lib/types';

const GiantArticleCard = ({ article }: { article: Article }) => {
  const { image, title, createdAt } = article ?? {};

  return (
    <div className='relative flex h-0 grow'>
      <img
        className='w-full cursor-pointer rounded-[3rem] object-cover'
        src={image}
        alt={title}
      />
      <Timestamp className='absolute bottom-8 right-8' time={createdAt} />
      <OpenLinkButton className='absolute right-8 top-8' />
    </div>
  );
};

export default GiantArticleCard;
