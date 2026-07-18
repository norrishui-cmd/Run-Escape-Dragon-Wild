import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const publisher='ca-pub-9505220977121599';
const meta=`<meta name="google-adsense-account" content="${publisher}">`;
const script=`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisher}" crossorigin="anonymous"></script>`;
const adsTxt='google.com, pub-9505220977121599, DIRECT, f08c47fec0942fa0\n';
const htmlFiles=[];

function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(['.git','node_modules'].includes(entry.name))continue;
    const target=path.join(dir,entry.name);
    if(entry.isDirectory())walk(target);
    else if(entry.name.endsWith('.html'))htmlFiles.push(target);
  }
}

walk(root);
for(const file of htmlFiles){
  let html=fs.readFileSync(file,'utf8');
  html=html
    .replace(/<meta name="google-adsense-account"[^>]*>\s*/gi,'')
    .replace(/<script\s+async\s+src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=[^"]+"\s+crossorigin="anonymous"><\/script>\s*/gi,'');
  if(!html.includes('</head>'))throw new Error(`${path.relative(root,file)} has no closing head tag`);
  html=html.replace('</head>',`${meta}${script}</head>`);
  fs.writeFileSync(file,html);
}
fs.writeFileSync(path.join(root,'ads.txt'),adsTxt);
console.log(`Configured AdSense publisher ${publisher} on ${htmlFiles.length} HTML files and wrote /ads.txt.`);
