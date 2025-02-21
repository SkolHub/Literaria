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
    <h1 className={cn('text-6xl font-bold italic laptop:text-4xl', className)}>
      {children}
    </h1>
  );
}
