import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const p=path.join(dir,e.name);e.isDirectory()?walk(p):e.name.endsWith('.html')&&files.push(p)}}
walk(root);

const errors=[];
const unique={canonical:new Map(),title:new Map(),description:new Map(),h1:new Map()};
const canonicals=new Set();
const paragraphs=new Map();
const adsensePublisher='ca-pub-9505220977121599';
const adsenseScript=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisher}`;
const remember=(kind,value,rel)=>{if(!value)return;if(unique[kind].has(value))errors.push(`${rel}: duplicate ${kind} with ${unique[kind].get(value)}`);else unique[kind].set(value,rel)};

for(const file of files){
  const s=fs.readFileSync(file,'utf8');
  const rel=path.relative(root,file);
  const accountTags=(s.match(/<meta name="google-adsense-account" content="ca-pub-9505220977121599">/g)||[]).length;
  const adsenseScripts=(s.match(/https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-9505220977121599/g)||[]).length;
  if(accountTags!==1)errors.push(`${rel}: expected one AdSense account meta tag, found ${accountTags}`);
  if(adsenseScripts!==1)errors.push(`${rel}: expected one AdSense loader, found ${adsenseScripts}`);
  if(file.endsWith('404.html'))continue;
  const one=(re,name)=>{const n=(s.match(re)||[]).length;if(n!==1)errors.push(`${rel}: expected one ${name}, found ${n}`)};
  one(/<title[ >]/gi,'title');
  one(/<meta name="description"/gi,'description');
  one(/rel="canonical"/gi,'canonical');
  one(/<h1[ >]/gi,'H1');

  const title=s.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const description=s.match(/<meta name="description" content="([^"]+)"/i)?.[1]?.trim();
  const canonical=s.match(/rel="canonical" href="([^"]+)"/i)?.[1];
  const h1=s.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim();
  remember('title',title,rel);remember('description',description,rel);remember('canonical',canonical,rel);remember('h1',h1,rel);
  if(canonical)canonicals.add(canonical);

  if(!s.includes('application/ld+json'))errors.push(`${rel}: missing structured data`);
  if(/\b(To be tested|Unknown|launch table template|SEO handling|lorem ipsum)\b/i.test(s))errors.push(`${rel}: editorial placeholder language`);
  if(rel!=='index.html'){
    const answer=s.match(/<div class="answer"><strong>(?:Quick answer:|Kurzantwort:|要点：)<\/strong>\s*([^<]+)<\/div>/i)?.[1]?.trim();
    const substantive=rel.startsWith('ja/')?answer?.length>=35:answer?.split(/\s+/).length>=12;
    if(!answer||!substantive)errors.push(`${rel}: missing a substantive direct answer`);
  }

  for(const href of [...s.matchAll(/href="(\/[^"]*)"/g)].map(m=>m[1])){
    const clean=href.split(/[?#]/)[0];
    if(!clean||clean==='/'||/\.[a-z0-9]+$/i.test(clean))continue;
    const target=path.join(root,clean.replace(/^\//,''),'index.html');
    if(!fs.existsSync(target))errors.push(`${rel}: broken internal link ${href}`);
  }

  const text=s.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  const enoughDepth=rel.startsWith('ja/')?text.replace(/\s+/g,'').length>=650:text.split(' ').length>=180;
  if(!enoughDepth)errors.push(`${rel}: insufficient visible content depth`);

  for(const match of s.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)){
    const p=match[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    if(p.length<120||p.startsWith('This pre-release page uses the official'))continue;
    if(paragraphs.has(p))errors.push(`${rel}: repeated long paragraph from ${paragraphs.get(p)}`);else paragraphs.set(p,rel);
  }
}

const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const adsTxt=fs.readFileSync(path.join(root,'ads.txt'),'utf8').trim();
if(adsTxt!=='google.com, pub-9505220977121599, DIRECT, f08c47fec0942fa0')errors.push('ads.txt: missing or incorrect Google publisher record');
const sitemapList=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const sitemapUrls=new Set(sitemapList);
if(sitemapList.length!==sitemapUrls.size)errors.push(`sitemap: contains ${sitemapList.length-sitemapUrls.size} duplicate URL entries`);
for(const url of canonicals)if(!sitemapUrls.has(url))errors.push(`sitemap: missing canonical ${url}`);
for(const url of sitemapUrls)if(!canonicals.has(url))errors.push(`sitemap: URL has no matching canonical ${url}`);

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`SEO audit passed: ${files.length-1} content pages; unique metadata; concrete answers; no broken links, repeated long paragraphs, or sitemap conflicts.`);
