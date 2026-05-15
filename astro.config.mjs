// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // WAJIB: Ganti dengan URL asli Anda nanti agar sitemap tidak error
  site: 'https://dailyrwa.com', 

  // Mengaktifkan integrasi (Pastikan tailwind berada di urutan pertama)
  integrations: [tailwind({
    // Memaksa Astro untuk menyuntikkan CSS dasar secara otomatis
    applyBaseStyles: true,
  }), sitemap(), react()],
  
  // Menghindari masalah routing di Windows dan hosting seperti Vercel/Netlify
  trailingSlash: 'never',

  // Mode statis untuk performa SEO maksimal
  output: 'static',

  // Memastikan pengerjaan di local tetap sinkron
  server: {
    port: 3000,
    host: true
  }
});