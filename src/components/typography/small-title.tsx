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
    <h3 className={cn('text-3xl font-semibold laptop:text-2xl', className)}>
      {children}
    </h3>
  );
}
