// Runs after `vite build`. Writes one HTML file per page (work.html, about.html, …) with that
// page's title, description, canonical URL, and social tags already in the <head>, so search
// engines and link previews see the right metadata without running JavaScript. Also writes
// 404.html (served with a real 404 status by Cloudflare) and sitemap.xml.
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const siteMeta = JSON.parse(await readFile(new URL('src/siteMeta.json', root), 'utf8'));
const template = await readFile(new URL('index.html', dist), 'utf8');

const SEO_BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->/;
if (!SEO_BLOCK.test(template)) {
  throw new Error('dist/index.html is missing the <!-- seo:start --> … <!-- seo:end --> block.');
}

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function headFor(route) {
  const url = route.path ? `${siteMeta.origin}${route.path}` : null;
  const title = escape(route.title);
  const description = escape(route.description);
  return [
    '<!-- seo:start -->',
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${route.index ? 'index, follow' : 'noindex, follow'}" />`,
    url ? `<link rel="canonical" href="${url}" />` : null,
    url ? `<meta property="og:url" content="${url}" />` : null,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    '<!-- seo:end -->',
  ]
    .filter(Boolean)
    .join('\n    ');
}

const routes = Object.values(siteMeta.routes);

for (const route of routes) {
  await writeFile(new URL(route.file, dist), template.replace(SEO_BLOCK, headFor(route)));
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes
    .filter((route) => route.index && route.path)
    .map((route) => `  <url><loc>${siteMeta.origin}${route.path}</loc><lastmod>${today}</lastmod></url>`),
  '</urlset>',
  '',
].join('\n');
await writeFile(new URL('sitemap.xml', dist), sitemap);

console.log(`prerender: wrote ${routes.map((route) => route.file).join(', ')}, sitemap.xml`);
