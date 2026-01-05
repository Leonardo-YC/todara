import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from 'next-pwa';
import withBundleAnalyzerInit from '@next/bundle-analyzer';

// 1. Configuración de Plugins
const withNextIntl = createNextIntlPlugin('./i18n.ts');

const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', 
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ['!icons/**/*'],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css|jpg|jpeg|gif|png|svg|ico|webp|js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-assets',
        expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\/api\/todos.*/i,
      handler: 'NetworkFirst',
      method: 'GET',
      options: {
        cacheName: 'api-cache',
        expiration: { maxEntries: 16, maxAgeSeconds: 5 * 60 },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // ✅ 1. Compresión Gzip/Brotli
  compress: true,
  
  // ✅ 2. Ocultar que usamos Next.js (Seguridad/Peso)
  poweredByHeader: false,

  // ✅ 3. Optimización de Imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'graph.microsoft.com' }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200], // Tamaños optimizados
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 31536000,
  },

  // ✅ 4. Optimizaciones Experimentales (Mejora carga de librerías grandes)
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion'],
    optimizeCss: true,
  },

  // ✅ 5. Limpiar console.log en Producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // ✅ 6. Headers de Seguridad
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
      // Caché agresivo para iconos y estáticos
      {
        source: '/icons/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      }
    ];
  },
};

// Combinamos: BundleAnalyzer -> PWA -> Intl -> Config
export default withBundleAnalyzer(withPWA(withNextIntl(nextConfig)));