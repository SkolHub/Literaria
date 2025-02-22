'use client';

import OpenLinkButton from '@/components/buttons/open-link-button';
import PhotoWithBlur from '@/components/misc/photo-with-blur';
import Timestamp from '@/components/misc/timestamp';
import { IncludeBorder } from '@/components/rounded-borders/include-border';
import { RoundedBorder } from '@/components/rounded-borders/rounded-border';
import { RoundedTextBorder } from '@/components/rounded-borders/rounded-text-border';
import { Article } from '@/lib/types';
import Link from 'next/link';

const GiantArticleCard = ({ article }: { article: Article }) => {
  const { image, title, author, createdAt } = article ?? {};

  return (
    <Link href={'/article/' + article.id} className='relative flex h-0 grow'>
      <PhotoWithBlur
        className='w-full cursor-pointer rounded-[3rem] laptop:rounded-[2rem]'
        src={image}
        alt={title}
      />
      <div className='absolute right-10 top-10 flex flex-col items-end gap-8 px-3 py-1 laptop:right-3 laptop:top-3 laptop:gap-4'>
        <RoundedBorder
          className='flex flex-col items-end'
          paddingTop={4}
          paddingBottom={8}
          paddingLeft={12}
          paddingRight={12}
          borderRadius={16}
        >
          <RoundedTextBorder className='w-[450px] text-end text-3xl font-semibold text-black mobile:w-[80vw] mobile:text-xl'>
            {title}
          </RoundedTextBorder>
          <IncludeBorder>
            <label>{author}</label>
          </IncludeBorder>
        </RoundedBorder>
        <OpenLinkButton />
      </div>
      <Timestamp
        className='absolute bottom-8 right-8 laptop:bottom-3 laptop:right-3'
        time={createdAt}
      />
    </Link>
  );
};

export default GiantArticleCard;
