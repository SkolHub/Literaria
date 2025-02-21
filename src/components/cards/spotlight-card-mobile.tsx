import TitleLabel from '@/components/typography/title-label';
import { dateFormatter } from '@/lib/formatters/date-formatter';
import { ArticlePreview } from '@/lib/types';
import Link from 'next/link';

export default function ({
  article,
  className = ''
}: {
  article: ArticlePreview;
  className?: string;
}) {
  const { title, createdAt, author } = article;

  return (
    <Link
      href={`/article/${article.id}`}
      className={`flex flex-col justify-between gap-5 rounded-[2rem] bg-[#5b5a36] p-5 ${className}`}
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
