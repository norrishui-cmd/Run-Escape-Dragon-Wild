import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>https:\/\/runescapedragonwilds\.wiki(.*?)<\/loc>/g)].map((match) => match[1]);
const failures = [];
const warnings = [];
const seen = { title: new Map(), description: new Map(), canonical: new Map() };

const text = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const match = (html, regex) => html.match(regex)?.[1]?.trim() || '';
const fileFor = (url) => url === '/' ? path.join(root, 'index.html') : path.join(root, url, 'index.html');

for (const url of urls) {
  const file = fileFor(url);
  if (!fs.existsSync(file)) { failures.push(`${url}: missing HTML file`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const title = match(html, /<title>([^<]+)<\/title>/i);
  const description = match(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const canonical = match(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const h1s = [...html.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gi)];
  const words = text(html).split(/\s+/).filter(Boolean).length;
  if (!title || title.length < 25 || title.length > 70) warnings.push(`${url}: title length ${title.length}`);
  if (!description || description.length < 110 || description.length > 170) warnings.push(`${url}: meta description length ${description.length}`);
  if (h1s.length !== 1) failures.push(`${url}: expected one H1, found ${h1s.length}`);
  if (canonical !== `https://runescapedragonwilds.wiki${url}`) failures.push(`${url}: canonical mismatch (${canonical})`);
  if (words < 120) warnings.push(`${url}: thin body (${words} words)`);
  if (!/application\/ld\+json/i.test(html)) warnings.push(`${url}: no structured data`);
  for (const [key, value] of Object.entries({ title, description, canonical })) {
    if (!value) continue;
    if (seen[key].has(value)) failures.push(`${url}: duplicate ${key} with ${seen[key].get(value)}`);
    else seen[key].set(value, url);
  }
  for (const href of [...html.matchAll(/href=["'](\/[^"'#?]*)["']/g)].map((m) => m[1])) {
    if (/\.(css|js|ico|png|xml|webmanifest)$/.test(href)) continue;
    const target = fileFor(href.endsWith('/') ? href : `${href}/`);
    if (!fs.existsSync(target)) failures.push(`${url}: broken internal link ${href}`);
  }
}

console.log(`Audited ${urls.length} canonical sitemap URLs.`);
console.log(`Failures: ${failures.length}; warnings: ${warnings.length}`);
if (warnings.length) console.log('\nWARNINGS\n' + warnings.join('\n'));
if (failures.length) { console.error('\nFAILURES\n' + failures.join('\n')); process.exit(1); }
