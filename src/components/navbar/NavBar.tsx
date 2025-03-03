'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import useNavBar from '@/components/navbar/useNavBar';
import NavBarLogo from '@/components/navbar/components/NavBarLogo';
import NavBarCategories from '@/components/navbar/components/NavBarCategories';
import SearchBar from '@/components/navbar/components/SearchBar';
import NavBarListExpanded from '@/components/navbar/components/NavBarListExpanded';
import BackgroundEffect from '@/components/navbar/components/BackgroundEffect';
import Image from 'next/image';
import menu from '../../../public/icons/menu.svg';

const navBarTransition = {
  bounce: 0,
  bounceDamping: 0,
  bounceStiffness: 0
};

export interface CategoryModel {
  title: string;
  id: number;
  children?: CategoryModel[];
}

export interface ArticleModel {
  title: string;
  id: number;
  parentTitle: string | undefined;
}

const NavBar = ({
  categories,
  articleNames
}: {
  categories: CategoryModel[];
  articleNames: ArticleModel[];
}) => {
  const { navMode } = useNavBar();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [isExtended, setIsExtended] = useState<boolean>(false);

  return (
    <>
      <motion.div
        onHoverEnd={() => {
          setExpanded(false);
        }}
        transition={navBarTransition}
        layout
        className={`fixed top-0 z-[1000] box-border flex w-screen flex-col bg-white px-8 pb-[0.8rem] pt-4 ${
          expanded ? 'mobile:h-[100svh]' : ''
        }`}
      >
        <motion.div
          layout
          className={`flex items-center justify-between ${
            navMode ? 'flex-col gap-0 mobile:flex-row' : 'flex-row gap-8'
          }`}
        >
          <NavBarLogo
            className={isExtended ? 'mobile:hidden' : ''}
            navMode={navMode}
          />
          <motion.div
            layout
            className={`box-border flex w-screen items-center gap-8 mobile:hidden ${
              navMode ? 'justify-center' : 'justify-between'
            }`}
          >
            <NavBarCategories
              categories={categories}
              setExpanded={setExpanded}
              setActiveCategory={setActiveCategory}
            />
            <SearchBar
              className='mobile:!hidden'
              isExtended={isExtended}
              setIsExtended={setIsExtended}
              articles={articleNames}
            />
          </motion.div>
          <motion.div className='flex grow items-center justify-end gap-4'>
            <SearchBar
              className={`!hidden mobile:!flex w-0 grow`}
              isExtended={isExtended}
              setIsExtended={setIsExtended}
              articles={articleNames}
            />
            {!isExtended ? (
              <Image
                onClick={() => {
                  setExpanded(!expanded);
                }}
                className='hidden h-4 w-auto rounded-none mobile:block '
                src={menu}
                alt='Top right arrow'
              />
            ) : (
              ''
            )}
          </motion.div>
        </motion.div>
        {expanded ? (
          <NavBarListExpanded
            categories={categories[activeCategory].children!}
            generalCategories={categories}
            setActiveCategory={setActiveCategory}
            setExpanded={setExpanded}
          />
        ) : (
          ''
        )}
      </motion.div>
      <BackgroundEffect setExpanded={setExpanded} expanded={expanded} />
    </>
  );
};

export default dynamic(() => Promise.resolve(NavBar), {
  ssr: false
});
