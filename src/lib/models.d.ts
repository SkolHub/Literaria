import { FullMetadata } from '@firebase/storage-types';

export interface Article {
  id: number;
  title: string;
  author: string;
  createdAt: Date;
  image: string;
  content: string;
  children: Article[];
}

export interface Image {
  name: string;
  src: string;
  metadata: FullMetadata;
}