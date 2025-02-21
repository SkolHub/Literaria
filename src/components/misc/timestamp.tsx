import { dateFormatter } from '@/lib/formatters/date-formatter';
import { cn } from '@/lib/utils';

export default ({
  time,
  className = ''
}: {
  time: Date;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-white px-4 py-1',
        className
      )}
    >
      <label className='text-base font-semibold'>
        {dateFormatter(new Date(time))}
      </label>
    </div>
  );
};
