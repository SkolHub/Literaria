'use client';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function BackButton({
  path,
  className
}: {
  path?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <div
      className={cn(
        'hidden cursor-pointer items-center gap-2 mobile:flex',
        className
      )}
    >
      <i className='fa fa-chevron-left text-lg' />
      <span
        className='text-lg hover:underline'
        onClick={() => {
          if (window.history?.length && window.history.length > 1) {
            if (path) {
              router.push(path);
            } else {
              router.back();
            }
          } else {
            router.push(path ?? '/');
          }
        }}
      >
        Înapoi
      </span>
    </div>
  );
}
