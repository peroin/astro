import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react'; // Tetap pertahankan untuk grafik/charts kamu

export default defineConfig({
  site: 'https://dailyrwa.com',
  
  // Ubah ke static (SSG) karena Obsidian hanya butuh file markdown statis.
  // Ini bikin web kamu gratis tissue-free di Cloudflare Pages tanpa limit serverless!
  output: 'static', 

  integrations: [
    tailwind({ applyBaseStyles: true }),
    sitemap(),
    react(), // Masih dipakai jika kamu pakai recharts / lucide-react
  ],
});