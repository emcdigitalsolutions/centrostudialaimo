// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Anteprima su GitHub Pages: PREVIEW_BASE=/centrostudialaimo/ (vedi scripts/preview.mjs)
const base = process.env.PREVIEW_BASE || '/';

export default defineConfig({
  site: 'https://centrostudialaimo.it',
  base,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/privacy/') && !page.includes('/404'),
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
});
