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
    <label className={cn('text-base font-medium laptop:text-xs', className)}>
      {children}
    </label>
  );
}
