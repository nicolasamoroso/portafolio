import { defineConfig } from 'astro/config';

// No framework integrations: the whole site is static HTML/CSS with a small
// vanilla runtime in public/js.
export default defineConfig({
  site: 'https://nicolasamoroso.com',
});
