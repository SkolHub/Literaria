import { Article } from '@/lib/types';
import PhotoWithBlur from '@/components/misc/photo-with-blur';

const SubCategoryCard = ({ article }: { article: Article }) => {
  const { image, title } = article;

  return (
    <div className='relative aspect-square w-[25rem]'>
      <PhotoWithBlur
        className='h-full w-full rounded-[3rem] object-cover'
        src={image}
        alt='sub-category image'
      />
      <div className='absolute bottom-0 left-0 box-border flex h-20 w-full items-center justify-start rounded-[0_0_3rem_3rem] pl-4 backdrop-blur-[0.3rem] backdrop-brightness-[0.8]'>
        <label className='text-[2rem] text-white'>{title}</label>
      </div>
    </div>
  );
};

export default SubCategoryCard;
