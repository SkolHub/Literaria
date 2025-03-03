'use client';

import { createDrafts } from '@/api/admin/draft';
import UploadArticles from '@/components/forms/upload-articles';
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
    </div>
  );
}
