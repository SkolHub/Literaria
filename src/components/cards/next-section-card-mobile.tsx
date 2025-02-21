'use client';

import OpenLinkButton from '@/components/buttons/open-link-button';
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
    <div className={`relative grow ${className}`}>
      <img
        src={image}
        className='h-full w-full rounded-[2rem] object-cover'
        alt='Next section'
      />
      <div className='absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-4 rounded-[2rem] p-4 backdrop-blur-[16px] backdrop-brightness-50'>
        <label className='left-0 top-0 text-center font-semibold text-white'>
          {text}
        </label>
        <Link href={anchorScroll}>
          <OpenLinkButton className='flex rotate-[135deg] scale-90' />
        </Link>
      </div>
    </div>
  );
}
