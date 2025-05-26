import { FullMetadata } from '@firebase/storage-types';

export interface CategoryModel {
  title: string;
  id?: number;
  titleID?: string;
  url?: string;
  fn?: () => Promise<void> | void;
  children?: CategoryModel[];
}

export interface ArticleModel {
  title: string;
  titleID: string;
  id: number;
  parentTitle: string | null | undefined;
  createdAt: string;
}

export interface Article {
  titleID: string;
  id: number;
  title: string;
  author: string;
  createdAt: Date;
  image: string;
  content: string;
  children: Article[];
  parentID: number | null;
  parent: Article;
}

export interface ArticlePreview {
  titleID: string;
  id: number;
  title: string;
  author: string;
  image: string;
  createdAt?: Date | string;
}

export interface Image {
  name: string;
  src: string;
  metadata: FullMetadata;
}

export interface CarouselCategoryModel {
  image: any;
  logo: any;
  title: string;
}
