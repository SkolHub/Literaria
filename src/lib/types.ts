import { FullMetadata } from '@firebase/storage-types';

export interface CategoryModel {
  title: string;
  id: number;
  children?: CategoryModel[];
}

export interface ArticleModel {
  title: string;
  id: number;
  parentTitle: string | null | undefined;
}

export interface Article {
  id: number;
  title: string;
  author: string;
  createdAt: Date;
  image: string;
  content: string;
  children: Article[];
}

export interface ArticlePreview {
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
