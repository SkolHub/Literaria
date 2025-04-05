import { getArticleIDs } from '@/api/article';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articleIDs = await getArticleIDs();

  return [
    {
      url: 'https://literaria.info/',
      priority: 1,
      changeFrequency: 'weekly'
    },
    {
      url: 'https://literaria.info/about',
      priority: 0.8,
      changeFrequency: 'weekly'
    },
    {
      url: 'https://literaria.info/gallery',
      priority: 0.8,
      changeFrequency: 'monthly'
    },
    ...articleIDs.map(
      (id) =>
        ({
          url: `https://literaria.info/article/${id}`,
          priority: 1,
          changeFrequency: 'weekly'
        }) as MetadataRoute.Sitemap[number]
    )
  ];
}
