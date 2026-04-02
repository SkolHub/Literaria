import Navbar from '@/components/layout/navbar/navbar';
import { ArticleModel, CategoryModel } from '@/lib/types';

export default function NavbarWrapper(props: {
  categories: CategoryModel[];
  articleNames: ArticleModel[];
  isAdmin: boolean;
}) {
  return <Navbar {...props} />;
}
