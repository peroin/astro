import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. KOLEKSI BLOG
const blog = defineCollection({
    loader: glob({ 
        pattern: '**/[^_]*.{md,mdx}', 
        base: "./src/content/blog" 
    }),
    schema: z.object({
        title: z.string().min(1, "Judul wajib diisi"),
        pubDate: z.coerce.date(),
        description: z.string().default("Global RWA market intelligence and institutional analysis."),
        image: z.string().default("/default-thumb.jpg"), 
        category: z.enum([
            'World', 
            'Market', 
            'Company', 
            'Institutional', 
            'Crypto'
        ]).default('World'),
        region: z.enum([
            'APAC', 
            'EMEA', 
            'Americas', 
            'Global', 
            'None'
        ]).default('Global'),
        author: z.string().default('Iqbal Maulana'),
        tags: z.array(z.string()).default([]),
    }),
});

// 2. KOLEKSI PAGES (Untuk About, Contact, dll)
const pages = defineCollection({
    loader: glob({ 
        pattern: '**/[^_]*.{md,mdx}', 
        base: "./src/content/pages" 
    }),
    schema: z.object({
        title: z.string().min(1),
        description: z.string(),
    }),
});

// 3. EXPORT KOLEKSI
export const collections = { 
    blog,
    pages
};