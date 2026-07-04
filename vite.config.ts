import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(() => ({
  plugins: [
    react(),
    // Bundle size report — always generated; open docs/bundle-report.html after build
    visualizer({
      filename: 'docs/bundle-report.html',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
    // Sentry source-map upload — only runs when auth token is set (CI/prod)
    process.env.SENTRY_AUTH_TOKEN &&
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORG ?? 'maharaja',
        project: process.env.SENTRY_PROJECT ?? 'maharaja-web',
        telemetry: false,
      }),
  ].filter(Boolean),

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Stable, rarely-changing — maximise cache hits
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'vendor-sentry': ['@sentry/react'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Dummy values so modules that eagerly construct the Supabase client
    // (src/lib/supabase.ts) don't throw on import when no real env/.env.local
    // is present — real network calls are never exercised by unit tests.
    env: {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/**/*.d.ts', 'src/main.tsx'],
    },
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
