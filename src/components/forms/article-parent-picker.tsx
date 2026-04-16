'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { buildTree } from '@/lib/utils/build-tree';
import { ChevronDown, ChevronRight, FolderTree } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type PickerArticle = {
  id: number;
  parentID: number | null;
  title: string;
  author: string;
  titleID?: string;
};

type TreeArticle = ReturnType<typeof buildTree<PickerArticle>>[number];

function ParentTreeRow({
  node,
  level,
  selectedId,
  expandedIds,
  onToggle,
  onSelect
}: {
  node: TreeArticle;
  level: number;
  selectedId: number | null;
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
  onSelect: (id: number) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(node.id);
    }
  }

  return (
    <>
      <div
        role='button'
        tabIndex={0}
        onClick={() => onSelect(node.id)}
        onKeyDown={handleKeyDown}
        className={cn(
          'grid cursor-pointer select-none grid-cols-[minmax(0,1fr)_180px] items-center gap-4 rounded-lg px-2 py-1.5',
          isSelected
            ? 'bg-neutral-900 text-white'
            : 'text-neutral-900 hover:bg-neutral-100'
        )}
      >
        <div
          className='flex min-w-0 items-center gap-2'
          style={{ paddingLeft: `${level * 18}px` }}
        >
          {hasChildren ? (
            <button
              type='button'
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-sm',
                isSelected ? 'hover:bg-white/10' : 'hover:bg-neutral-200'
              )}
              onClick={(event) => {
                event.stopPropagation();
                onToggle(node.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </button>
          ) : (
            <span className='block h-5 w-5 shrink-0' />
          )}
          <span className='truncate'>{node.title}</span>
        </div>
        <span
          className={cn(
            'truncate text-sm',
            isSelected ? 'text-white/80' : 'text-neutral-500'
          )}
        >
          {node.author}
        </span>
      </div>
      {hasChildren && isExpanded
        ? node.children.map((child) => (
            <ParentTreeRow
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))
        : null}
    </>
  );
}

export default function ArticleParentPicker({
  articles,
  selectedParentId,
  onSelect
}: {
  articles: PickerArticle[];
  selectedParentId: number | null;
  onSelect: (id: number | null) => void;
}) {
  const [open, setOpen] = useState(false);

  const articleMap = useMemo(
    () => new Map(articles.map((article) => [article.id, article])),
    [articles]
  );
  const tree = useMemo(() => buildTree(articles), [articles]);

  const selectedArticle =
    selectedParentId !== null ? articleMap.get(selectedParentId) : undefined;

  const selectedPath = useMemo(() => {
    if (!selectedArticle) {
      return 'Fără părinte';
    }

    const trail: string[] = [];
    const visited = new Set<number>();
    let currentArticle: PickerArticle | undefined = selectedArticle;

    while (currentArticle && !visited.has(currentArticle.id)) {
      visited.add(currentArticle.id);
      trail.unshift(currentArticle.title);
      currentArticle =
        currentArticle.parentID !== null
          ? articleMap.get(currentArticle.parentID)
          : undefined;
    }

    return trail.join(' / ');
  }, [articleMap, selectedArticle]);

  const defaultExpandedIds = useMemo(() => {
    const ids = new Set<number>(tree.map((root) => root.id));

    let currentArticle =
      selectedParentId !== null ? articleMap.get(selectedParentId) : undefined;

    while (currentArticle) {
      if (currentArticle.parentID === null) {
        break;
      }

      ids.add(currentArticle.parentID);
      currentArticle = articleMap.get(currentArticle.parentID);
    }

    return ids;
  }, [articleMap, selectedParentId, tree]);

  const [expandedIds, setExpandedIds] =
    useState<Set<number>>(defaultExpandedIds);

  useEffect(() => {
    if (open) {
      setExpandedIds(new Set(defaultExpandedIds));
    }
  }, [defaultExpandedIds, open]);

  function toggleExpanded(id: number) {
    setExpandedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='outline'
          className='h-auto min-h-11 w-full justify-between rounded-xl px-3 py-2'
        >
          <div className='flex min-w-0 flex-col items-start text-left'>
            <span
              className={cn(
                'truncate',
                selectedArticle || selectedParentId === null
                  ? 'text-neutral-900'
                  : 'text-neutral-500'
              )}
            >
              {selectedArticle?.title ??
                (selectedParentId === null
                  ? 'Fără părinte'
                  : 'Selectează articolul părinte...')}
            </span>
            <span className='truncate text-xs text-neutral-500'>
              {selectedPath}
            </span>
          </div>
          <FolderTree className='ml-3 h-4 w-4 shrink-0 opacity-60' />
        </Button>
      </DialogTrigger>
      <DialogContent className='grid h-[min(82vh,760px)] max-w-4xl grid-rows-[auto_1fr] gap-0 overflow-hidden p-0'>
        <DialogHeader className='border-b px-6 py-4'>
          <DialogTitle>Alege articolul părinte</DialogTitle>
        </DialogHeader>

        <div className='grid min-h-0 grid-rows-[auto_auto_1fr]'>
          <div className='grid grid-cols-[minmax(0,1fr)_180px] gap-4 border-b px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500'>
            <span>Nume</span>
            <span>Autor</span>
          </div>

          <div className='border-b p-2'>
            <div
              role='button'
              tabIndex={0}
              onClick={() => {
                onSelect(null);
                setOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(null);
                  setOpen(false);
                }
              }}
              className={cn(
                'grid cursor-pointer select-none grid-cols-[minmax(0,1fr)_180px] items-center gap-4 rounded-lg px-2 py-1.5',
                selectedParentId === null
                  ? 'bg-neutral-900 text-white'
                  : 'hover:bg-neutral-100'
              )}
            >
              <span className='truncate'>Fără părinte</span>
              <span
                className={cn(
                  'truncate text-sm',
                  selectedParentId === null
                    ? 'text-white/80'
                    : 'text-neutral-500'
                )}
              >
                Nivel principal
              </span>
            </div>
          </div>

          <div className='overflow-y-auto p-2'>
            <div className='flex flex-col gap-0.5'>
              {tree.map((node) => (
                <ParentTreeRow
                  key={node.id}
                  node={node}
                  level={0}
                  selectedId={selectedParentId}
                  expandedIds={expandedIds}
                  onToggle={toggleExpanded}
                  onSelect={(id) => {
                    onSelect(id);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
