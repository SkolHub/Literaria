import { Image as ImageType } from '@/lib/models';
import Image from 'next/image';
import React from 'react';

const ImageCard = ({
  image,
  onClick,
  index
}: {
  image: ImageType;
  onClick: (index: number) => void;
  index: number;
}) => {
  return (
    <div className='aspect-square relative w-[300px]'>
      <Image
        src={image.src}
        alt='poza'
        key={index}
        width={300}
        height={300}
        onClick={() => {
          onClick(index);
        }}
        className={'w-[300px] h-[300px] object-cover rounded-3xl cursor-pointer'}
      />
      {!!image.metadata.customMetadata?.description && (
        <div className='absolute w-full backdrop-blur-[0.3rem] backdrop-brightness-[0.8] flex items-center justify-start min-h-14 box-border pl-4 left-0 bottom-0 rounded-b-3xl pb-1 rounded-t-lg'>
          <label className='text-white text-sm'>
            {image.metadata.customMetadata?.description}
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
