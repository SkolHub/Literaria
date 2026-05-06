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

export interface ArticleContent {
  articleID: number;
  content: string;
}

export interface ArticleParent {
  id: number;
  title: string;
  titleID: string;
}

export interface ArticleParentChainItem {
  id: number;
  title: string;
  title_id: string;
}

export interface Article {
  titleID: string;
  id: number;
  title: string;
  author: string;
  createdAt: Date | string;
  image: string;
  content?: ArticleContent | null;
  children: Article[];
  parentID: number | null;
  parent?: (ArticleParent & { children?: ArticlePreview[] }) | null;
  parentChain?: ArticleParentChainItem[];
  siblings?: ArticlePreview[];
  authorOtherArticles?: ArticlePreview[];
}

export interface ArticlePreview {
  titleID: string;
  id: number;
  title: string;
  author: string;
  image: string;
  createdAt?: Date | string;
}

export interface ImageMetadata {
  title?: string;
  description?: string;
  contentType?: string;
}

export interface Image {
  key: string;
  url: string;
  metadata: ImageMetadata;
}

export interface CarouselCategoryModel {
  image: string;
  logo: string;
  title: string;
}
