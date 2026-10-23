/**
 * Writes public/sitemap.xml: the site's pages plus one entry per live product (read from the API).
 * Runs automatically before every `npm run build` (the "prebuild" script) so the sitemap follows the
 * catalogue. It never fails a build: if the API can't be reached it keeps the sitemap already in
 * public/, or writes one with the fixed pages only.
 *
 * Settings (environment variables, both optional):
 *   REACT_APP_SITE_URL     default https://gharelubake.in
 *   REACT_APP_BACKEND_URL  default https://api.gharelubake.in
 */
const fs = require("fs");
const path = require("path");

const SITE = (process.env.REACT_APP_SITE_URL || "https://gharelubake.in").replace(/\/+$/, "");
const API = (process.env.REACT_APP_BACKEND_URL || "https://api.gharelubake.in").replace(/\/+$/, "");
const OUT = path.join(__dirname, "..", "public", "sitemap.xml");

// [path, priority, changefreq]
const PAGES = [
  ["/", "1.0", "daily"],
  ["/catalogue", "0.9", "daily"],
  ["/hampers", "0.9", "weekly"],
  ["/customize-cake", "0.8", "monthly"],
  ["/order", "0.7", "monthly"],
  ["/about", "0.6", "monthly"],
  ["/events", "0.5", "monthly"],
  ["/gallery", "0.5", "monthly"],
  ["/reviews", "0.5", "weekly"],
  ["/faq", "0.5", "monthly"],
  ["/contact", "0.6", "monthly"],
  ["/privacy", "0.2", "yearly"],
  ["/terms", "0.2", "yearly"],
  ["/refund", "0.2", "yearly"],
];

async function productSlugs() {
  const slugs = [];
  for (let page = 1; page <= 20; page += 1) {
    const res = await fetch(`${API}/api/v1/products?per_page=50&page=${page}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`API answered ${res.status}`);
    const body = await res.json();
    (body.data || []).forEach((p) => p.id && slugs.push(String(p.id)));
    if (page >= (body.meta?.last_page ?? 1)) break;
  }
  return slugs;
}

const escapeXml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function build(slugs) {
  const today = new Date().toISOString().slice(0, 10);
  const entry = (loc, priority, changefreq) =>
    `  <url>\n    <loc>${escapeXml(SITE + loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...PAGES.map(([loc, priority, changefreq]) => entry(loc, priority, changefreq)),
    ...slugs.map((slug) => entry(`/product/${encodeURIComponent(slug)}`, "0.7", "weekly")),
    "</urlset>",
    "",
  ].join("\n");
}

(async () => {
  try {
    const slugs = await productSlugs();
    fs.writeFileSync(OUT, build(slugs));
    console.log(`sitemap.xml: ${PAGES.length} pages + ${slugs.length} products`);
  } catch (err) {
    if (fs.existsSync(OUT)) {
      console.warn(`sitemap.xml: API not reachable (${err.message}); keeping the existing file.`);
    } else {
      fs.writeFileSync(OUT, build([]));
      console.warn(`sitemap.xml: API not reachable (${err.message}); wrote the fixed pages only.`);
    }
  }
})();
