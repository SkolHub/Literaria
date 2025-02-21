import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { useState } from 'react';

export default function ArticleTreeSidebar({ articles }: any) {
  // Track expanded state of each node
  const [expanded, setExpanded] = useState(new Set());

  const toggleNode = (id: any) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const TreeNode = ({ node, level = 0 }: any) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.has(node.id);

    return (
      <div className='select-none'>
        <div
          className={cn(
            'flex cursor-pointer items-center rounded px-2 py-1 hover:bg-gray-100',
            'transition-colors duration-150 ease-in-out'
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            } else {
              // Navigate to article
              window.location.href = `/articles/${node.id}`;
            }
          }}
        >
          <div className='flex items-center gap-2'>
            {hasChildren ? (
              <div className='flex h-4 w-4 items-center justify-center'>
                {isExpanded ? (
                  <ChevronDown className='h-4 w-4 text-gray-500' />
                ) : (
                  <ChevronRight className='h-4 w-4 text-gray-500' />
                )}
              </div>
            ) : (
              <FileText className='h-4 w-4 text-gray-500' />
            )}
            <span className='text-sm'>{node.title}</span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className='ml-2'>
            {node.children.map((child: any) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='h-full w-64 overflow-y-auto border-r bg-white'>
      <div className='p-4'>
        <h2 className='mb-4 text-lg font-semibold'>Articles</h2>
        {articles.map((article: any) => (
          <TreeNode key={article.id} node={article} />
        ))}
      </div>
    </div>
  );
}
