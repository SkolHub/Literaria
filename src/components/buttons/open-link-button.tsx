import { cn } from '@/lib/utils';
import Link from 'next/link';

export default ({
  url = '',
  className = ''
}: {
  url?: string;
  className?: string;
}) => {
  return (
    <Link
      className={cn(
        'flex aspect-square h-12 w-12 items-center justify-center rounded-full bg-white p-4',
        className
      )}
      href={url}
    >
      <i className='fa fa-arrow-up-right text-2xl' />
    </Link>
  );
};
