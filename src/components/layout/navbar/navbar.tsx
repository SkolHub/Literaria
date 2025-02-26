'use client';

import { logout } from '@/api/admin/auth';
import BackgroundBlur from '@/components/layout/navbar/background-blur';
import NavbarCategories from '@/components/layout/navbar/navbar-categories';
import NavbarListExpanded from '@/components/layout/navbar/navbar-list-expanded';
import NavbarLogo from '@/components/layout/navbar/navbar-logo';
import SearchBar from '@/components/layout/navbar/search-bar';
import useNavbar from '@/components/layout/navbar/use-navbar';
import { ArticleModel, CategoryModel } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ({
  categories,
  articleNames,
  isAdmin
}: {
  categories: CategoryModel[];
  articleNames: ArticleModel[];
  isAdmin: boolean;
}) {
  if (typeof window === 'undefined') {
    return;
  }

  const navMode = useNavbar();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [isExtended, setIsExtended] = useState<boolean>(false);

  return (
    <>
      <motion.div
        onHoverEnd={() => {
          setExpanded(false);
        }}
        transition={{
          bounce: 0,
          bounceDamping: 0,
          bounceStiffness: 0
        }}
        layout
        className={cn(
          'fixed top-0 z-[1000] box-border flex w-screen flex-col bg-white px-8 pb-[0.8rem] pt-4',
          expanded && 'mobile:h-[100svh]'
        )}
      >
        <motion.div
          layout
          className={cn(
            'flex items-center justify-between',
            navMode ? 'flex-col gap-0 mobile:flex-row' : 'flex-row gap-8'
          )}
        >
          <NavbarLogo
            className={cn(isExtended && 'mobile:hidden')}
            navMode={navMode}
          />
          <motion.div
            layout
            className={cn(
              'box-border flex w-screen items-center gap-8 mobile:hidden',
              navMode ? 'justify-center' : 'justify-between'
            )}
          >
            <NavbarCategories
              isAdmin={isAdmin}
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
              className='!hidden w-0 grow mobile:!flex'
              isExtended={isExtended}
              setIsExtended={setIsExtended}
              articles={articleNames}
            />
            {!isExtended && (
              <div
                className='hidden mobile:block'
                onClick={() => {
                  setExpanded(!expanded);
                }}
              >
                <i className='fa fa-bars h-4 w-auto rounded-none mobile:block' />
              </div>
            )}
          </motion.div>
        </motion.div>
        {expanded && (
          <NavbarListExpanded
            categories={
              activeCategory !== -10
                ? categories[activeCategory].children!
                : [
                    {
                      url: '/admin/article/create',
                      title: 'Dashboard',
                      children: []
                    },
                    {
                      url: '/admin/gallery',
                      title: 'Galerie',
                      children: []
                    },
                    {
                      async fn() {
                        await logout();
                      },
                      title: 'Sign Out',
                      children: []
                    }
                  ]
            }
            generalCategories={categories}
            setActiveCategory={setActiveCategory}
            setExpanded={setExpanded}
          />
        )}
      </motion.div>
      <BackgroundBlur expanded={expanded} setExpanded={setExpanded} />
    </>
  );
}
