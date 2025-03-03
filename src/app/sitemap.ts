import { MetadataRoute } from 'next';
import { db } from '@/lib/api/drizzle';
import { article } from '../../drizzle/schema';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await db
    .select({
      id: article.id
    })
    .from(article);

  return [
    ...articles.map((art) => ({
      url: `https://literaria.com/article/${art.id}`,
      lastModified: new Date()
    })),
    {
      url: 'https://literaria.info/gallery',
      lastModified: new Date()
    },
    {
      url: 'https://literaria.info/about'
    },
    {
      url: 'https://literaria.info',
      priority: 1
    }
  ];
}
