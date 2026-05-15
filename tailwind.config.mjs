/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Skema warna Premium Financial News
        'brand-red': '#ff0000',      // Aksen utama DAILYRWA
        'ft-paper': '#fff1e5',       // Warna krem khas koran untuk header/promo
        'ft-text': '#1a1a1a',        // Hitam elegan untuk teks utama
        'ft-muted': '#666666',       // Abu-abu untuk metadata
        'ft-border': '#e2e2e2',      // Border halus untuk pemisah artikel
      },
      fontFamily: {
        // Playfair untuk Headings (Otoritas), Inter untuk Body (Keterbacaan)
        'serif': ['"Playfair Display"', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-headings': theme('colors.ft-text'),
            '--tw-prose-links': theme('colors.brand-red'),
            '--tw-prose-bullets': theme('colors.brand-red'),
            '--tw-prose-quote-borders': theme('colors.brand-red'),
            maxWidth: '100ch', // Sedikit lebih lebar agar riset teknis nyaman dibaca
            fontFamily: theme('fontFamily.sans').join(', '),
            h1: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontStyle: 'italic',
              fontWeight: '900',
            },
            h2: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontWeight: '700',
            },
            h3: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontWeight: '700',
            },
            blockquote: {
              fontStyle: 'italic',
              color: theme('colors.ft-muted'),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};