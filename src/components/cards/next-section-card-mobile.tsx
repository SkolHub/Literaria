'use client';

import OpenLinkButton from '@/components/buttons/open-link-button';
import PhotoWithBlur from '@/components/misc/photo-with-blur';
import Link from 'next/link';

export default function ({
  text,
  image,
  className = '',
  anchorScroll
}: {
  text: string;
  image: string;
  className: string;
  anchorScroll: string;
}) {
  return (
    <Link className={`relative grow ${className}`} href={anchorScroll}>
      <PhotoWithBlur
        src={image}
        className='h-full w-full rounded-[2rem]'
        alt='Next section'
      />
      <div className='absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-4 rounded-[2rem] p-4 backdrop-blur-[16px] backdrop-brightness-50'>
        <label className='left-0 top-0 text-center font-semibold text-white'>
          {text}
        </label>
        <OpenLinkButton className='flex rotate-[135deg] scale-90' />
      </div>
    </Link>
  );
}
