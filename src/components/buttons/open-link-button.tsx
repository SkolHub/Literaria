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
    <div
      className={cn(
        'flex aspect-square h-12 w-12 items-center justify-center rounded-full bg-white p-4 mobile:w-8 mobile:h-8 mobile:max-w-8',
        className
      )}
    >
      <i className='fa fa-arrow-up-right text-2xl mobile:text-xl' />
    </div>
  );
};
