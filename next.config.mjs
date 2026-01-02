import createNextIntlPlugin from 'next-intl/plugin';

// Inicializamos el plugin apuntando al archivo i18n.ts
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Tus headers de seguridad (Los mantenemos intactos)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ],
      },
    ];
  },
};

// Exportamos la configuración envuelta en withNextIntl
export default withNextIntl(nextConfig);