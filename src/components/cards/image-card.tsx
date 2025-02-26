import PhotoWithBlur from '@/components/misc/photo-with-blur';
import { Image as ImageType } from '@/lib/types';

export default function ({
  image,
  onClick,
  index
}: {
  image: ImageType;
  onClick: (index: number) => void;
  index: number;
}) {
  return (
    <div className='relative aspect-square w-[300px]'>
      <PhotoWithBlur
        src={image.src}
        alt='poza'
        key={index}
        onClick={() => {
          onClick(index);
        }}
        className={'h-[300px] w-[300px] cursor-pointer rounded-3xl'}
      />
      {!!image.metadata.customMetadata?.description && (
        <div className='absolute bottom-0 left-0 box-border flex min-h-14 w-full items-center justify-start rounded-b-3xl rounded-t-lg pb-1 pl-4 backdrop-blur-[0.3rem] backdrop-brightness-[0.8]'>
          <label className='text-sm text-white'>
            {image.metadata.customMetadata?.description}
          </label>
        </div>
      )}
    </div>
  );
}
