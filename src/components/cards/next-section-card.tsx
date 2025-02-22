'use client';

import OpenLinkButton from '@/components/buttons/open-link-button';
import PhotoWithBlur from '@/components/misc/photo-with-blur';
import SmallTitle from '@/components/typography/small-title';
import Link from 'next/link';

const NextSectionCard = ({
  text,
  image,
  className = '',
  anchorScroll
}: {
  text: string;
  image: string;
  className: string;
  anchorScroll: string;
}) => {
  const handleClick = () => {};

  return (
    <div className={`relative h-0 w-full grow ${className}`}>
      <PhotoWithBlur
        src={image}
        className='h-full w-full rounded-[3rem] tablet:rounded-[2rem]'
        alt='Next section'
      />
      <div className='absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-8 rounded-[3rem] p-4 backdrop-blur-[20px] backdrop-brightness-50 tablet:rounded-[2rem]'>
        <SmallTitle className='left-0 top-0 text-center text-white'>
          {text}
        </SmallTitle>
        <Link href={anchorScroll}>
          <OpenLinkButton className='flex rotate-[135deg] scale-90' />
        </Link>
      </div>
    </div>
  );
};

export default NextSectionCard;
