import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), sitemap()],

  vite: {
    // Optimize for performance
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['lucide-react', 'framer-motion'],
            'astro-vendor': ['astro'],
          },
          // Optimize chunk naming
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      // Enable source maps for production debugging
      sourcemap: false,
      // Optimize for size
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', 'framer-motion'],
    },
    // Performance optimizations
    ssr: {
      noExternal: ['framer-motion'],
    },
    // Enable experimental features for better performance
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        if (hostType === 'js') {
          return { js: `/${filename}` };
        } else {
          return { relative: true };
        }
      },
    },
  },

  // Static site generation (no adapter needed)

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
  output: 'static',
  site:
    process.env.NODE_ENV === 'production'
      ? 'https://johnciresi.com'
      : 'http://localhost:3000',

  // Compress output
  compressHTML: true,

  // Server configuration
  server: {
    port: 3000,
    host: true,
  },
});
