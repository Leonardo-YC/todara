import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/profile'], // No indexar perfil ni apis
    },
    sitemap: 'https://todara.app/sitemap.xml',
  };
}