// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mrt.vercel.app',
  integrations: [
    expressiveCode({
      themes: ['one-dark-pro', 'one-light'],
      styleOverrides: {
        borderWidth: '0px',
        borderRadius: '8px',
      },
    }),
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
