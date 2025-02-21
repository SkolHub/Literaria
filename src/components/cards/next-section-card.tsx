'use client';

import NextItemButton from '@/components/buttons/NextItemButton';
import Link from 'next/link';
import OpenLinkButton from '@/components/buttons/OpenLinkButton';

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
    <div className={`relative w-full h-0 grow ${className}`}>
      <img
        src={image}
        className='object-cover w-full h-full rounded-[3rem] tablet:rounded-[2rem]'
        alt='Next section'
      />
      <div className='absolute w-full h-full flex gap-8 items-center justify-center flex-col backdrop-blur-[20px] backdrop-brightness-50 rounded-[3rem] tablet:rounded-[2rem] left-0 top-0 p-4'>
        <label className='small-title text-white left-0 top-0 text-center'>
          {text}
        </label>
        <Link href={anchorScroll}>
          <OpenLinkButton className='rotate-[135deg] flex scale-90' />
        </Link>
      </div>
    </div>
  );
};

export default NextSectionCard;
