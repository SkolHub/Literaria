import { cn } from '@/lib/utils';

export default ({
  url = '',
  className = ''
}: {
  url?: string;
  className?: string;
}) => {
  return (
    <div>
      <div
        className={cn(
          'flex aspect-square items-center justify-center rounded-full bg-white p-4',
          className
        )}
      >
        <i className='fa fa-arrow-up-right text-2xl' />
      </div>
    </div>
  );
};
