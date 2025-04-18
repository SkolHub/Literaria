'use client';

import TitleLabel from '@/components/typography/title-label';
import { dateFormatter } from '@/lib/formatters/date-formatter';
import { ArticlePreview } from '@/lib/types';
import Link from 'next/link';
import { Vibrant } from 'node-vibrant/browser';
import { CSSProperties, useEffect, useState } from 'react';

export default function ({
  article,
  image,
  swatch = 'Muted',
  className = '',
  style
}: {
  article: ArticlePreview;
  image: string;
  swatch?: 'Muted' | 'DarkVibrant';
  className?: string;
  style?: CSSProperties;
}) {
  const { title, createdAt, author } = article;
  const [color, setColor] = useState<string>('#ffffff');

  useEffect(() => {
    if (image) {
      Vibrant.from(image)
        .getPalette()
        .then((palette) => {
          if (palette[swatch]?.hex === '#ffffff') {
            setColor('#5b5a36');
          } else {
            setColor(palette[swatch]?.hex ?? '#5b5a36');
          }
        })
        .catch(() => {
          setColor('#5b5a36');
        });
    }
  }, [image]);

  return (
    <Link
      href={`/article/${article.titleID}`}
      className={`flex flex-col justify-between gap-5 rounded-[2rem] p-5 ${className}`}
      style={{
        ...style,
        backgroundColor: color
      }}
    >
      <h1 className='line-clamp-2 text-ellipsis font-semibold text-white'>
        {title}
      </h1>
      <div className='flex flex-col'>
        <TitleLabel className='text-white'>
          {dateFormatter(new Date(createdAt as string))}
        </TitleLabel>
        <TitleLabel className='text-white'>{author}</TitleLabel>
      </div>
    </Link>
  );
}
