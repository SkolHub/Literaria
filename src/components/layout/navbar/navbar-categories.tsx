import { CategoryModel } from '@/lib/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

export default function ({
  setExpanded,
  setActiveCategory,
  categories,
  isAdmin
}: {
  setExpanded: Dispatch<SetStateAction<boolean>>;
  setActiveCategory: Dispatch<SetStateAction<number>>;
  categories: CategoryModel[];
  isAdmin: boolean;
}) {
  const onHoverStart = (index: number) => {
    setExpanded(true);
    setActiveCategory(index);
  };

  return (
    <motion.div layout className='flex gap-8'>
      {categories.map((category, index) => (
        <motion.label
          className='cursor-pointer text-[1.05rem] font-bold hover:underline'
          onHoverStart={() => {
            onHoverStart(index);
          }}
          key={index}
        >
          <Link
            href={`/article/${category.id}`}
            onClick={() => {
              setExpanded(false);
            }}
          >
            {category.title}
          </Link>
        </motion.label>
      ))}
      <motion.label
        className='cursor-pointer text-[1.05rem] font-bold hover:underline'
        onHoverStart={() => {
          setExpanded(false);
        }}
        onClick={() => {
          setExpanded(false);
        }}
      >
        <Link href='/gallery'>Galerie</Link>
      </motion.label>
      <motion.label
        className='cursor-pointer text-[1.05rem] font-bold hover:underline'
        onHoverStart={() => {
          setExpanded(false);
        }}
        onClick={() => {
          setExpanded(false);
        }}
      >
        <Link href='/about'>Despre noi</Link>
      </motion.label>
      <motion.label
        className='cursor-pointer text-[1.05rem] font-bold hover:underline'
        onHoverStart={() => {
          onHoverStart(-10);
        }}
        onClick={() => {
          setExpanded(false);
        }}
      >
        {isAdmin && <Link href='/admin/article/create'>Admin</Link>}
      </motion.label>
    </motion.div>
  );
}
