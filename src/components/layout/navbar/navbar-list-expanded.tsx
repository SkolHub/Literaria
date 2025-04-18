import NavbarCategoryList from '@/components/layout/navbar/navbar-category-list';
import { CategoryModel } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';

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

export default function ({
  categories,
  generalCategories,
  setActiveCategory,
  setExpanded
}: {
  categories: CategoryModel[];
  generalCategories: CategoryModel[];
  setActiveCategory: Dispatch<SetStateAction<number>>;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  const [onCategory, setOnCategory] = useState<boolean>(false);

  return (
    <>
      <motion.div
        layout
        className={cn(
          'flex gap-16 py-8 pl-32 laptop:gap-12 laptop:pl-20 tablet:pl-12 mobile:hidden',
          categories.length > 4 && 'justify-center pl-0'
        )}
      >
        {categories.map((category, index) => (
          <NavbarCategoryList
            category={category}
            key={index}
            setExpanded={setExpanded}
          />
        ))}
      </motion.div>
      <motion.div
        layout
        className='hidden h-[100svh] flex-col gap-4 overflow-auto pb-12 pt-6 [scrollbar-width:none] mobile:flex'
      >
        {onCategory ? (
          <>
            {categories.map((category, index) => (
              <motion.label
                initial={opacity0}
                animate={opacity1}
                transition={{
                  delay: index * 0.04
                }}
                exit={exit}
                key={index}
              >
                <Link
                  href={`/article/${category.titleID}`}
                  className={
                    (category.children?.length
                      ? 'title-label'
                      : 'small-title') + ' flex items-center gap-3'
                  }
                  onClick={() => {
                    setExpanded(false);
                  }}
                >
                  {category.title}
                  <i className='fa fa-chevron-right text-sm' />
                </Link>
                <div className='flex flex-col'>
                  {category.children?.map((child, index) => (
                    <Link
                      href={`/article/${child.titleID}`}
                      onClick={() => {
                        setExpanded(false);
                      }}
                      className='small-title'
                      key={index}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              </motion.label>
            ))}
          </>
        ) : (
          <>
            {generalCategories.map((category, index) => (
              <motion.label
                initial={opacity0}
                animate={opacity1}
                transition={{
                  delay: index * 0.04
                }}
                exit={exit}
                className='small-title'
                onClick={() => {
                  setActiveCategory(index);
                  setOnCategory(true);
                }}
                key={index}
              >
                {category.title}
              </motion.label>
            ))}
            <motion.label
              initial={opacity0}
              animate={opacity1}
              transition={{
                delay: generalCategories.length * 0.04
              }}
              exit={exit}
              className='small-title'
              onClick={() => {
                setExpanded(false);
              }}
            >
              <Link href='/gallery'>Galerie</Link>
            </motion.label>
            <motion.label
              initial={opacity0}
              animate={opacity1}
              transition={{
                delay: (generalCategories.length + 1) * 0.04
              }}
              exit={exit}
              className='small-title'
              onClick={() => {
                setExpanded(false);
              }}
            >
              <Link href='/about'>Despre noi</Link>
            </motion.label>
          </>
        )}
      </motion.div>
    </>
  );
}
