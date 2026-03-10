import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'], // Protegemos el área privada
    },
    sitemap: 'https://todara.vercel.app/sitemap.xml', // Cambia al dominio real cuando lo lances
  };
}