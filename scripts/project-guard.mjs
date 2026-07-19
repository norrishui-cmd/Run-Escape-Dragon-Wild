import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const expectedDomain = 'runescapedragonwilds.wiki';
const forbiddenDomains = [['nivalis', 'nights.wiki'].join('')];
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const failures = [];
if (packageJson.name !== 'runescape-dragonwilds-field-guide') {
  failures.push(`unexpected package name: ${packageJson.name || '(missing)'}`);
}

for (const required of ['generate-phase1.mjs', 'generate-phase2.mjs', 'generate-phase3.mjs', 'generate-locales.mjs', 'generate-tab-news.mjs', 'generate-faq.mjs', 'configure-adsense.mjs']) {
  if (!fs.existsSync(path.join(root, 'scripts', required))) failures.push(`missing required generator: scripts/${required}`);
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(target);
    return [target];
  });
}

const textFiles = walk(root).filter((file) => /\.(?:html|mjs|js|json|xml|txt)$/.test(file));
for (const file of textFiles) {
  const value = fs.readFileSync(file, 'utf8');
  for (const domain of forbiddenDomains) {
    if (value.includes(domain)) failures.push(`${path.relative(root, file)} contains foreign domain ${domain}`);
  }
}

if (failures.length) {
  console.error(`Dragonwilds project guard failed:\n${failures.map((item) => `- ${item}`).join('\n')}`);
  process.exit(1);
}

console.log(`Dragonwilds project guard passed for ${expectedDomain}.`);
