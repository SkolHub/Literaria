import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <section className='section gap-12 px-8 pb-10 pt-32 tablet:gap-7 mobile:flex-col mobile:gap-3 mobile:px-4'>
      <div className='flex grow flex-col'>
        <Skeleton className='mb-3 h-20 w-1/2 rounded-2xl' />
        <Skeleton className='relative flex h-0 grow rounded-3xl' />
      </div>
      <div className='flex min-w-[30%] max-w-[30%] flex-col gap-10 tablet:gap-6 mobile:max-w-none mobile:flex-row mobile:gap-3'>
        <div className='flex h-[150px] grow gap-3'>
          <Skeleton className={`hidden w-1/2 rounded-[2rem] p-5 mobile:flex`} />
          <Skeleton className={`hidden w-1/2 rounded-[2rem] p-5 mobile:flex`} />
        </div>
        <Skeleton className='flex min-h-[50%] tablet:grow mobile:hidden rounded-3xl' />
        <Skeleton className='flex min-h-[40%] tablet:grow mobile:hidden rounded-3xl' />
      </div>
    </section>
  );
}
