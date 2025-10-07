import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Premium 2025 Astro Configuration
export default defineConfig({
  site: 'https://johnciresi.com',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],

  vite: {
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['lucide-react', 'framer-motion'],
            'audio-vendor': ['web-audio-api'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', 'framer-motion'],
    },
    ssr: {
      noExternal: ['framer-motion'],
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    },
  },

  adapter: vercel({
    webAnalytics: { enabled: false },
    speedInsights: { enabled: true },
    imageService: true,
    imagesConfig: {
      sizes: [320, 640, 768, 1024, 1280, 1536],
      formats: ['image/webp', 'image/avif'],
      domains: [],
    },
  }),

  build: {
    inlineStylesheets: 'auto',
  },

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    remotePatterns: [],
  },

  output: 'static',
  compressHTML: true,

  server: {
    port: 3000,
    host: true,
  },
});
