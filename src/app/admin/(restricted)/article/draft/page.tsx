import { getDrafts } from '@/api/admin/draft';
import DraftForm from '@/components/forms/upload-draft-form';
import Link from 'next/link';

export default async function () {
  const drafts = await getDrafts();

  return (
    <main className='flex grow flex-col items-center overflow-auto px-12 pb-20 pt-20'>
      <DraftForm />
      <div className='flex w-full max-w-[800px] flex-col gap-2 pt-4'>
        {drafts.map((draft) => (
          <Link
            href={`/admin/article/draft/${draft.id}`}
            className='rounded-md border border-black px-2 py-2'
          >
            <label className='text-xl'>
              {draft.id} | {draft.title ? draft.title : <i>No title</i>}
            </label>
          </Link>
        ))}
      </div>
    </main>
  );
}
