'use client';

import { createDrafts } from '@/api/admin/draft';
import UploadArticles from '@/components/forms/upload-articles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function () {
  const router = useRouter();

  return (
    <div className='flex w-full max-w-[800px] flex-col gap-4'>
      <UploadArticles
        onUpload={async (articles) => {
          await createDrafts(articles);

          router.refresh();
        }}
      />
      <Link className='w-full' href='/admin/article/draft/create'>
        <Button className='w-full'>Creează un draft</Button>
      </Link>
    </div>
  );
}
