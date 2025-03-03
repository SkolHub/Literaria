import { motion } from 'framer-motion';
import Link from 'next/link';
import { CategoryModel } from '@/components/navbar/NavBar';
import { Dispatch, SetStateAction } from 'react';

const opacity0 = {
  opacity: 0
};

const opacity1 = {
  opacity: 1
};

const exit = {
  opacity: 0,
  transition: {
    duration: 0.2
  }
};

const NavBarCategoryList = ({
  category,
  setExpanded
}: {
  category: CategoryModel;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className='flex flex-col'>
      <motion.h1 className={category.children?.length ? 'nav-title' : 'nav-item'} initial={opacity0} animate={opacity1}>
        <Link
          href={`/article/${category.id}`}
          onClick={() => {
            setExpanded(false);
          }}
        >
          {category.title}
        </Link>
      </motion.h1>
      <div className='flex flex-col'>
        {category.children?.map((directory, index) => (
          <motion.label
            className='nav-item line-clamp-1 break-words'
            initial={opacity0}
            animate={opacity1}
            transition={{
              delay: index * 0.04
            }}
            key={index}
            exit={exit}
          >
            <Link
              href={`/article/${directory.id}`}
              onClick={() => {
                setExpanded(false);
              }}
            >
              {directory.title}
            </Link>
          </motion.label>
        ))}
      </div>
    </div>
  );
};

export default NavBarCategoryList;
