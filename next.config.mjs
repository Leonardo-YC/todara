import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from 'next-pwa';

// 1. Configuración de i18n
const withNextIntl = createNextIntlPlugin('./i18n.ts');

// 2. Configuración de PWA
const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Desactivar en desarrollo
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      // Cachear Google Fonts
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
    {
      // Cachear Archivos Estáticos (JS, CSS, Imágenes)
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css|jpg|jpeg|gif|png|svg|ico|webp|js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-assets',
        expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    {
      // Cachear API (NetworkFirst: Intenta internet, si falla usa caché)
      urlPattern: /\/api\/todos.*/i,
      handler: 'NetworkFirst',
      method: 'GET',
      options: {
        cacheName: 'api-cache',
        expiration: { maxEntries: 16, maxAgeSeconds: 5 * 60 }, // 5 minutos
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Headers de seguridad (TUS HEADERS ORIGINALES)
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

// 3. Exportación combinada: PWA -> i18n -> Config
export default withPWA(withNextIntl(nextConfig));