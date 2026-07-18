import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const publisher = 'pub-9505220977121599';
const account = `ca-${publisher}`;
const meta = `<meta name="google-adsense-account" content="${account}">`;
const loader = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${account}" crossorigin="anonymous"></script>`;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(target);
    return [target];
  });
}

const htmlFiles = walk(root).filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');

  // Remove old or duplicated account markers/loaders before adding the canonical pair.
  html = html.replace(/<meta\s+name=["']google-adsense-account["'][^>]*>\s*/gi, '');
  html = html.replace(/<script\s+async\s+src=["']https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=[^"']+["'][^>]*><\/script>\s*/gi, '');

  if (!/<\/head>/i.test(html)) throw new Error(`Missing </head> in ${path.relative(root, file)}`);
  html = html.replace(/<\/head>/i, `${meta}${loader}</head>`);
  fs.writeFileSync(file, html);
}

fs.writeFileSync(path.join(root, 'ads.txt'), `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`);
console.log(`Configured AdSense account ${account} on ${htmlFiles.length} HTML files and wrote ads.txt.`);
