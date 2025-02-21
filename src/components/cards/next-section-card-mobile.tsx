'use client';

import Link from 'next/link';
import OpenLinkButton from '@/components/buttons/OpenLinkButton';

export default ({
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
  return (
    <div className={`relative grow ${className}`}>
      <img
        src={image}
        className='object-cover w-full h-full rounded-[2rem]'
        alt='Next section'
      />
      <div className='absolute w-full h-full flex gap-4 items-center justify-center flex-col backdrop-blur-[16px] backdrop-brightness-50 rounded-[2rem] left-0 top-0 p-4'>
        <label className='font-semibold text-white left-0 top-0 text-center'>
          {text}
        </label>
        <Link href={anchorScroll}>
          <OpenLinkButton className='rotate-[135deg] flex scale-90' />
        </Link>
      </div>
    </div>
  );
};
