'use client';

import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Edit, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SidebarArticle {
  id: number;
  title: string;
  titleID: string;
  children?: SidebarArticle[];
}

export function TreeNode({
  node,
  level = 0
}: {
  node: SidebarArticle;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const hasChildren = node.children && node.children.length > 0;
  const [hover, setHover] = useState<boolean>(false);

  function handleClick() {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      router.push(`/admin/article/${node.titleID}`);
    }
  }

  return (
    <div className='select-none'>
      <div
        className={cn(
          'flex cursor-pointer items-center rounded px-2 py-1 hover:bg-gray-100',
          'transition-colors duration-150 ease-in-out'
        )}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ paddingLeft: `${level * 4 + 8}px` }}
        onClick={handleClick}
      >
        <div className='flex w-full items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            {hasChildren ? (
              <div className='flex h-4 w-4 items-center justify-center'>
                {isExpanded ? (
                  <ChevronDown className='max-h-4 min-h-4 min-w-4 max-w-4 text-gray-500' />
                ) : (
                  <ChevronRight className='max-h-4 min-h-4 min-w-4 max-w-4 text-gray-500' />
                )}
              </div>
            ) : (
              <FileText className='max-h-4 min-h-4 min-w-4 max-w-4 text-gray-500' />
            )}
            <span className='line-clamp-2 text-sm'>{node.title}</span>
          </div>
          {hover && hasChildren && (
            <Link href={`/admin/article/${node.titleID}`}>
              <Edit className='max-h-4 min-h-4 min-w-4 max-w-4 text-gray-500' />
            </Link>
          )}
        </div>
      </div>
      {node.children && node.children.length > 0 && isExpanded && (
        <div className='ml-2'>
          {node.children.map((child: SidebarArticle) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArticleTreeSidebar({
  articles
}: {
  articles: SidebarArticle[];
}) {
  return (
    <div className='flex h-full w-64 flex-col overflow-y-auto bg-white py-4'>
      {articles.map((article) => (
        <TreeNode key={article.id} node={article} />
      ))}
    </div>
  );
}
