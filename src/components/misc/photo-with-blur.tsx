import { cn } from '@/lib/utils';

export default function PhotoWithBlur({
  src,
  alt,
  className,
  onClick
}: {
  src: string;
  alt: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn('relative h-full w-full overflow-hidden', className)}
      onClick={onClick}
    >
      <div className='absolute inset-0'>
        <img
          className='h-full w-full scale-110 object-cover blur-2xl brightness-75'
          src={src}
          alt={alt}
          crossOrigin='anonymous'
        />
      </div>
      <img
        className='relative h-full w-full object-contain'
        src={src}
        alt={alt}
        crossOrigin='anonymous'
      />
    </div>
  );
}
