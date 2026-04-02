import MainTitle from '@/components/typography/main-title';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='flex min-h-[calc(100dvh-4rem)] flex-col px-8 pt-[5rem]'>
      <MainTitle className='py-4'>Galerie</MainTitle>
      <Skeleton className='h-12 w-1/4 py-4' />
      <div className='mt-4 flex'>
        <div className='max-sm:justify-center flex flex-wrap gap-3 pb-10'>
          <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
          <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
          <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
          <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
        </div>
      </div>
      <Skeleton className='h-12 w-1/4 py-4' />
      <div className='mt-4 flex'>
        <div className='max-sm:justify-center flex flex-wrap gap-3 pb-10'>
          <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
          <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
          <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
        </div>
      </div>
    </div>
  );
}
