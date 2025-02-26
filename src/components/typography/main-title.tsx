import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export default function ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1 className={cn('text-6xl font-bold italic tablet:text-3xl', className)}>
      {children}
    </h1>
  );
}
