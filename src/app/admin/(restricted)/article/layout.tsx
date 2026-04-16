import { getAllSidebarArticles } from '@/api/admin/article';
import ArticleTreeSidebar from '@/app/admin/login/article-sidear';
import { Button } from '@/components/ui/button';
import { buildTree } from '@/lib/utils/build-tree';
import { Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

export default async function ({ children }: { children: ReactNode }) {
  const articles = await getAllSidebarArticles();

  return (
    <div className='flex h-full w-full overflow-hidden pt-20'>
      <aside className='flex h-full flex-col border-r px-4'>
        <h2 className='mb-4 text-lg font-semibold'>Articole</h2>
        <div className='flex flex-col gap-2'>
          <Link href='/admin/article/create'>
            <Button className='w-full' size='sm'>
              <Plus className='h-4 w-4' />
              Creează un articol
            </Button>
          </Link>
          <Link href='/admin/article/draft'>
            <Button className='w-full' size='sm' variant='outline'>
              <Upload className='h-4 w-4' />
              Încarcă drafturi
            </Button>
          </Link>
        </div>
        <ArticleTreeSidebar articles={buildTree(articles)} />
      </aside>
      {children}
    </div>
  );
}
