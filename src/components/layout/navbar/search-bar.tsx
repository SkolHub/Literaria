import { dateFormatter } from '@/lib/formatters/date-formatter';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArticleModel } from '@/lib/types';
import { cn } from '@/lib/utils';
import { filterAndSortStrings } from '@/lib/utils/search-scoring';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Dispatch, SetStateAction, useRef, useState } from 'react';

export default function ({
  articles,
  className,
  isExtended,
  setIsExtended
}: {
  articles: ArticleModel[];
  className: string;
  isExtended: boolean;
  setIsExtended: Dispatch<SetStateAction<boolean>>;
}) {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  const searchBarRef = useRef<HTMLInputElement>(null);
  const searchBar = searchBarRef.current;

  function handleMouseEnter() {
    setIsExtended(true);
    searchBar?.focus();
  }

  function handleMouseLeave() {
    if (searchBar?.value === '') {
      setIsExtended(false);
    }
  }

  function handleSearch(text: string) {
    setSearchTerm(text);
    setSearchResults(
      filterAndSortStrings(
        articles.map((article) => article.title + ' || ' + article.parentTitle),
        text
      ).slice(0, 5)
    );
  }

  return (
    <>
      <motion.div
        layout
        className={cn(
          'relative flex justify-end rounded-[10rem] border border-solid outline-none transition-colors mobile:hidden',
          isExtended && 'bg-white',
          !isExtended && 'mobile:border-none',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.input
          placeholder='Căutați...'
          className={cn(
            'rounded-[10rem] border-[none] bg-transparent outline-none placeholder:opacity-50',
            isExtended
              ? 'text-black placeholder:text-black'
              : 'text-inherit'
          )}
          initial={{
            width: 0
          }}
          animate={{
            width: isExtended ? 300 : 0,
            padding: isExtended ? '0 0 0 1rem' : 0
          }}
          ref={searchBarRef}
          onBlur={handleMouseLeave}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          value={searchTerm}
        />
        <motion.div
          layout
          onClick={() => {
            setSearchTerm('');
            setIsExtended(true);
            searchBarRef.current?.focus();
          }}
          className='flex aspect-[1] h-12 w-12 cursor-pointer items-center justify-center rounded-[5rem] transition-colors duration-200'
          style={{
            backgroundColor: isExtended
              ? '#000000'
              : isMobile
                ? 'transparent'
                : 'rgb(var(--literaria-article-nav-search-bg-rgb, 0, 0, 0))'
          }}
        >
          <motion.i
            layout
            className={cn(
              'fa-solid text-lg transition-colors duration-200',
              searchTerm.length === 0 ? 'fa-search' : 'fa-xmark'
            )}
            style={{
              color: isExtended
                ? '#ffffff'
                : isMobile
                  ? 'rgb(var(--literaria-article-nav-foreground-rgb, 0, 0, 0))'
                  : 'rgb(var(--literaria-article-nav-search-fg-rgb, 255, 255, 255))'
            }}
          />
        </motion.div>
        {searchTerm.length > 0 && (
          <ul className='absolute left-0 top-14 w-full rounded-3xl border border-solid bg-white py-3'>
            {searchResults.map((result, index) => {
              const article = articles.find(
                (article) => article.title === result.split(' || ')[0]
              ) ?? {
                id: -1,
                title: '',
                parentTitle: '',
                createdAt: new Date(),
                titleID: ''
              };

              return (
                <Link
                  href={`/article/${article.titleID}`}
                  key={index}
                  onClick={() => {
                    setSearchTerm('');
                    setIsExtended(false);
                  }}
                >
                  <li className='cursor-pointer px-4 py-2 hover:bg-gray-200'>
                    <p className='font-medium leading-tight'>{article.title}</p>
                    <p className='text-sm opacity-50'>
                      {article.parentTitle} -{' '}
                      {dateFormatter(new Date(article.createdAt))}
                    </p>
                  </li>
                </Link>
              );
            })}
            {searchResults.length === 0 && (
              <li className='px-4 text-gray-500'>Niciun rezultat</li>
            )}
          </ul>
        )}
      </motion.div>
    </>
  );
}
