import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const adsTxt = fs.readFileSync(path.join(root, 'ads.txt'), 'utf8').trim();
const urls = [...sitemap.matchAll(/<loc>https:\/\/runescapedragonwilds\.wiki(.*?)<\/loc>/g)].map((match) => match[1]);
const failures = [];
const warnings = [];
const seen = { title: new Map(), description: new Map(), canonical: new Map() };

if (adsTxt !== 'google.com, pub-9505220977121599, DIRECT, f08c47fec0942fa0') {
  failures.push('ads.txt: publisher declaration is missing or incorrect');
}

const text = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const match = (html, regex) => html.match(regex)?.[1]?.trim() || '';
const fileFor = (url) => url === '/' ? path.join(root, 'index.html') : path.join(root, url, 'index.html');

const faqHtml = fs.readFileSync(path.join(root, 'faq', 'index.html'), 'utf8');
const faqAnchors = [...faqHtml.matchAll(/<details class=["']faq-item["'] id=["']([^"']+)["']/g)].map((item) => item[1]);
if (faqAnchors.length !== 50 || new Set(faqAnchors).size !== 50) failures.push(`FAQ: expected 50 unique visible questions, found ${faqAnchors.length}`);
const faqGraphs = [...faqHtml.matchAll(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)].map((block) => {
  try { return JSON.parse(block[1]); } catch { return null; }
});
const faqSchema = faqGraphs.find((graph) => graph?.['@type'] === 'FAQPage');
if (faqSchema?.mainEntity?.length !== 50) failures.push(`FAQ: expected 50 schema questions, found ${faqSchema?.mainEntity?.length || 0}`);
const linkedFaqs = new Set();
for (const tab of ['guides','quests','resources','skills-builds','troubleshooting','updates']) {
  const hub = fs.readFileSync(path.join(root,tab,'index.html'),'utf8');
  for (const item of hub.matchAll(/href=["']\/faq\/#([^"']+)["']/g)) linkedFaqs.add(item[1]);
}
for (const anchor of faqAnchors) if (!linkedFaqs.has(anchor)) failures.push(`FAQ: #${anchor} has no related tab entry link`);

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
  const adsenseAccounts = [...html.matchAll(/<meta\s+name=["']google-adsense-account["']\s+content=["']ca-pub-9505220977121599["']\s*>/gi)];
  const adsenseLoaders = [...html.matchAll(/<script\s+async\s+src=["']https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-9505220977121599["']\s+crossorigin=["']anonymous["']><\/script>/gi)];
  if (adsenseAccounts.length !== 1) failures.push(`${url}: expected one AdSense account meta tag, found ${adsenseAccounts.length}`);
  if (adsenseLoaders.length !== 1) failures.push(`${url}: expected one AdSense loader, found ${adsenseLoaders.length}`);
  for (const block of html.matchAll(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(block[1]); } catch { failures.push(`${url}: invalid JSON-LD`); }
  }
  if (/^\/(combat|systems|skills|buildings|equipment|enemies|mounts|troubleshooting)\//.test(url) || /^\/(quests|dedicated-servers)\/.+\/$/.test(url) || url === '/scorned-wilderness/') {
    if (!/class=["']quick-answer["']/.test(html)) failures.push(`${url}: missing concrete quick answer`);
    if (words < 150) failures.push(`${url}: Phase 2 page is too thin (${words} words)`);
  }
  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((item) => text(item[1]).toLowerCase())
    .filter((paragraph) => paragraph.length >= 100
      && !paragraph.includes('unofficial fan resource')
      && !paragraph.includes('official details on this page were checked')
      && !paragraph.includes('inoffizielles fanprojekt')
      && !paragraph.includes('guide de fans non officiel'));
  const paragraphSet = new Set();
  for (const paragraph of paragraphs) {
    if (paragraphSet.has(paragraph)) failures.push(`${url}: repeated substantive paragraph`);
    paragraphSet.add(paragraph);
  }
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
