'use client';

import dynamic from 'next/dynamic';
import { ArticleModel, CategoryModel } from '@/lib/types';

const Navbar = dynamic(() => import('@/components/layout/navbar/navbar'), {
  ssr: false
});

export default function (props: {
  categories: CategoryModel[];
  articleNames: ArticleModel[];
  isAdmin: boolean;
}) {
  return <Navbar {...props} />;
}
