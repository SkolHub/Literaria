import { cn } from '@/lib/utils';

export default function ({
  onClick,
  className
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex h-10 w-10 cursor-pointer items-center justify-center rounded-[5rem] bg-[#ffffffcc] backdrop-blur-[0.1rem] hover:bg-[#ffffff]',
        className
      )}
    >
      <i className='fa fa-arrow-up-right text-2xl' />
    </div>
  );
}
