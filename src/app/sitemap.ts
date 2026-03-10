import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://todara.vercel.app'; // Cambia al dominio real luego

  const locales = ['es', 'en'];
  const routes = ['', '/about', '/legal/terms', '/legal/privacy'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8, // Prioridad máxima a la Landing
      });
    }
  }

  return sitemapEntries;
}