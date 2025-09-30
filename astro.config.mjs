// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    sitemap(),
    mdx(),
  ],

  vite: {
    // Optimize for performance
    build: {
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['lucide-react', 'framer-motion'],
          },
        },
      },
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', 'framer-motion'],
    },
    // Performance optimizations
    ssr: {
      noExternal: ['framer-motion'],
    },
  },

  // Vercel adapter with optimizations
  adapter: vercel({
    webAnalytics: { enabled: false },
  }),

  // Build optimizations
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },

  // Image optimization
  image: {
    domains: ['localhost'],
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },

  // Output configuration
  output: 'server',
  site: process.env.NODE_ENV === 'production' ? 'https://chezik.eu' : 'http://localhost:3000',

  // Compress output
  compressHTML: true,

  // Server configuration
  server: {
    port: 3000,
    host: true,
  },
});