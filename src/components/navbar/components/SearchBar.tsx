import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { ArticleModel } from '@/components/navbar/NavBar';
import Fuse, { FuseResult } from 'fuse.js';
import Link from 'next/link';
import '@/ui/fontawesome/css/fa.css';

const width0 = { width: 0 };

const SearchBar = ({
  articles,
  className,
  isExtended,
  setIsExtended
}: {
  articles: ArticleModel[];
  className: string;
  isExtended: boolean;
  setIsExtended: Dispatch<SetStateAction<boolean>>;
}) => {
  const [searchResults, setSearchResults] = useState<
    FuseResult<{ id: number; title: string }>[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');

  const searchBarRef = useRef<HTMLInputElement>(null);
  const searchBar = searchBarRef.current;

  const inputAnimate = {
    width: isExtended ? 300 : 0,
    // fontSize: isExtended ? '1rem' : 0,
    padding: isExtended ? '0 0 0 1rem' : 0
  };

  const handleMouseEnter = () => {
    setIsExtended(true);
    searchBar?.focus();
  };

  const handleMouseLeave = () => {
    if (searchBar?.value === '') {
      setIsExtended(false);
    }
  };

  const handleSearch = (text: string) => {
    const fuse = new Fuse(articles, {
      keys: ['title', 'parentTitle'],
      threshold: 0.3
    });
    setSearchTerm(text);
    setSearchResults(fuse.search(text).slice(0, 5));
  };

  return (
    <>
      <motion.div
        layout
        className={`relative flex rounded-[10rem] border border-solid ${isExtended ? '' : 'mobile:border-none'} justify-end outline-none mobile:hidden ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.input
          placeholder='Căutați...'
          className='rounded-[10rem] border-[none] bg-transparent outline-none'
          initial={width0}
          animate={inputAnimate}
          ref={searchBarRef}
          onBlur={handleMouseLeave}
          onChange={(e) => handleSearch(e.target.value)}
          value={searchTerm}
        />
        <motion.div
          layout
          onClick={() => {
            setSearchTerm('');
            setIsExtended(true);
            searchBarRef.current?.focus();
          }}
          className={`flex aspect-[1] h-12 w-12 cursor-pointer items-center justify-center rounded-[5rem] bg-black ${isExtended ? '' : 'mobile:bg-white'} transition-colors duration-200`}
        >
          <motion.i
            layout
            className={`fa-solid ${searchTerm.length === 0 ? 'fa-search' : 'fa-xmark'} text-lg text-white ${isExtended ? '' : 'mobile:text-black'} transition-colors duration-200`}
          ></motion.i>
        </motion.div>
        {searchTerm.length > 0 ? (
          <ul className='absolute left-0 top-14 w-full rounded-3xl border border-solid bg-white py-3'>
            {searchResults.map((result, index) => (
              <Link
                href={`/article/${result.item.id}`}
                key={index}
                onClick={() => {
                  setSearchTerm('');
                  setIsExtended(false);
                }}
              >
                <li className='cursor-pointer px-4 py-1 hover:bg-gray-200'>
                  {result.item.title}
                </li>
              </Link>
            ))}
            {searchResults.length === 0 ? (
              <li className='px-4 text-gray-500'>Niciun rezultat</li>
            ) : null}
          </ul>
        ) : null}
      </motion.div>
    </>
  );
};

export default SearchBar;
