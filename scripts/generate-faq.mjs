import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://runescapedragonwilds.wiki';
const reviewed = '2026-07-19';

const sources = {
  steam: ['Official Steam store page', 'https://store.steampowered.com/app/1374490/RuneScape_Dragonwilds/'],
  console: ['Official console release announcement', 'https://dragonwilds.runescape.com/news/console-release-date'],
  switch2: ['Official Switch 2 announcement', 'https://dragonwilds.runescape.com/news/dragonwilds-switch-2'],
  road: ['Official 0.12.1 and release roadmap', 'https://dragonwilds.runescape.com/news/0.12.1-and-the-road-to-release'],
  combat: ['Official 0.12.1 combat preview', 'https://dragonwilds.runescape.com/news/0-12-1-combat'],
  vital: ['Official 0.12 live issues and hotfixes', 'https://dragonwilds.runescape.com/news/0.12-vital-info'],
  update12: ['Official 0.12.0 update notes', 'https://dragonwilds.runescape.com/news/eye-on-ashenfall-0.12.0'],
  update11: ['Official 0.11 update notes', 'https://dragonwilds.runescape.com/news/dowdun-reach'],
  health: ['Official health and Wardstones rework', 'https://dragonwilds.runescape.com/news/health-and-wardstones'],
  stations: ['Official crafting-station overhaul', 'https://dragonwilds.runescape.com/news/umbral-crafting-overhaul'],
  water: ['Official Water Magic preview', 'https://dragonwilds.runescape.com/news/introducing-water-magic'],
  server: ['Official dedicated-server guide', 'https://dragonwilds.runescape.com/news/how-to-dedicated-servers']
};

const groups = {
  guides: {title:'Release, Platforms & General Play', items:[
    ['what-is-dragonwilds','What is RuneScape: Dragonwilds?','It is a cooperative survival adventure set on Ashenfall, with gathering, building, crafting, skills, exploration and combat. It can be played solo or online with other players and is being developed by Jagex.','steam'],
    ['early-access-release','When did Dragonwilds enter Early Access?','The Steam Early Access release date is April 15, 2025. That is different from the announced 1.0 release date, so guides should not use the two dates interchangeably.','steam'],
    ['full-release-date','When is the Dragonwilds full release?','Jagex has announced September 15, 2026 for the 1.0 launch. The plan includes PC, PlayStation 5 and Xbox Series X|S, with a separate official announcement giving Nintendo Switch 2 the same date.','console'],
    ['ps5-xbox-release','Is Dragonwilds coming to PS5 and Xbox?','Yes. PlayStation 5 and Xbox Series X|S are officially announced for September 15, 2026. Older pages saying console versions are unconfirmed are now outdated.','console'],
    ['switch-2-release','Is Dragonwilds coming to Nintendo Switch 2?','Yes. Jagex announced a Nintendo Switch 2 release for September 15, 2026 and specifically mentioned GameChat support. The announcement describes solo play or a party with up to three friends.','switch2'],
    ['crossplay','Will Dragonwilds support crossplay?','Yes. Crossplay is explicitly confirmed in the official PC, PS5 and Xbox full-release announcement. The announcement does not by itself confirm every cross-progression or save-transfer detail.','console'],
    ['solo-play','Can Dragonwilds be played solo?','Yes. The official store lists single-player, and Jagex describes the adventure as playable alone or with friends. Dedicated-server setup is optional rather than a requirement for solo play.','steam'],
    ['standard-coop-size','How many players can join normal co-op?','The official launch messaging describes playing alone or with up to three friends, meaning a four-player party. Dedicated servers use a separate documented capacity of up to six players.','switch2'],
    ['supported-languages','Which languages does Dragonwilds support?','Steam lists English, French, Italian, German, Spanish from Spain, Latin American Spanish, Brazilian Portuguese, Simplified Chinese, Japanese and Korean for interface and subtitles. The store does not mark full audio support for these languages.','steam']
  ]},
  quests: {title:'Quests & Progression Blockers', items:[
    ['quests-added-0-11','Which quests were added in update 0.11?','The official 0.11 notes list Black Knight’s Fortress, Wanted!, Biohazard and What’s Theirs Is Mine. Players on older clients or servers must update before expecting this quest set.','update11'],
    ['moon-garou-rewards','What do Moon Garou quests unlock?','The Umbral Sands content connects Moon Garou quests with new resources, rewards, cosmetics and the Magic Carpet mount. Normal quest prerequisites still apply; seeing a customization does not necessarily unlock the mount system.','update12'],
    ['contact-marker-wrong','Why is the Contact! quest marker wrong?','Jagex lists an issue where the Contact! marker can show an incorrect location or size. Use the active objective, landmarks and visible paths instead of treating the entire marked boundary as exact.','vital'],
    ['contact-barrier-invisible','Why is the Contact! Chamber barrier invisible?','The Chamber barrier can be invisible on Medium graphics settings and below. Temporarily raise the graphics preset, reload the area and check the intended progression point again.','vital'],
    ['beast-sand-trail','Why can’t I see the Beast in the Sand trail?','The Sand VFX trail is a confirmed issue for client players. In co-op, ask whether the host can see it and follow the host and written objective rather than restarting the world.','vital'],
    ['lagra-inventory-full','Why won’t Lagra accept the quest items?','Lagra can reject the hand-in when the player inventory is full. Free at least one slot, keep the required quest items, then restart the conversation. Do not discard unique quest objects.','vital'],
    ['rogue-trader-moonstone','Why are Rogue Trader map icons incorrect?','Collecting a Moonstone before starting Rogue Trader can make its map icons display incorrectly. Keep the item and follow the written objective; do not delete the Moonstone merely to normalize the markers.','vital'],
    ['wild-hunt-mount-access','Why do I have a mount prompt but no usable mount?','Jagex notes that unlocking a mount skin before acquiring the Terrorbird can leave a defunct prompt. Complete The Wild Hunt to gain the underlying mount access even if a customization appeared earlier.','vital']
  ]},
  resources: {title:'Resources, Recipes & Crafting', items:[
    ['crafting-stations-changed','Which crafting stations changed in 0.12?','Gear production was separated into the Blacksmith’s Bench for tools and melee weapons, Fletching Bench for ranged weapons, Mystic Forge for magic weapons and Vestiges, and Armour Bench for armour.','update12'],
    ['old-benches-destroyed','Did 0.12 destroy old crafting benches?','Jagex warned that existing Fletching Benches and Smithing Anvils would be destroyed on login, with their components left for rebuilding. Collect the refunded materials before assuming they were permanently lost.','stations'],
    ['adamant-bolts-locked','Do Adamant Bolts require Adamant Arrows first?','No, not on a current build. Patch 0.12.0.4 removed that unintended prerequisite. If the recipe still behaves that way, update both the client and dedicated server.','vital'],
    ['fuzan-shield-component','Which shield belongs in the Fuzan Dragonfire Shield recipe?','The intended component is the Anti-Dragon Shield. Jagex warned players not to consume Dragonblight Shields when the early 0.12 recipe displayed the wrong component.','vital'],
    ['new-materials-0-12','Which major materials were added in Umbral Sands?','Update 0.12 added Adamant Ore, Yew Wood, Infinity Cloth and Red Dragonhide progression. These support new tools, weapons, ammunition, robes and armour through the revised crafting stations.','update12'],
    ['vestige-armour-sets','Which Vestige armour sets were added?','The official notes list Lunar Garou and Desert Robes for magic, Kalphite Carapace for ranged and Obsidian for melee. Comparisons should state the intended combat role rather than call one set universally best.','update12'],
    ['storage-level-59','When do specialized resource storages unlock?','Ore and Stone Storage unlocks through Mining level 59, while Lumber Storage unlocks through Woodcutting level 59. Both are part of the expanded level 50–99 progression.','update12'],
    ['ascension-cores','Where do Ascension Cores come from?','The Nightmare Crucible is the confirmed source. Players find Engrams around Umbral Sands to access the boss-rush-style challenge, which awards Ascension Cores for powerful upgrades ahead of Scorned Wilderness.','update12']
  ]},
  'skills-builds': {title:'Skills, Health & Combat', items:[
    ['skill-cap-99','What is the Dragonwilds skill cap?','Update 0.11 raised the cap of existing skills to 99. The cap increase did not mean every higher-level content tier was immediately complete; later updates have continued filling specific progression bands.','update11'],
    ['mining-50-99','What was added to Mining levels 50–99?','Update 0.12 added Divine Rock, Ore and Stone Storage, larger Rocksplosion effects, gemstone opportunities and ingot-weight reduction across the Mining 50–99 progression.','update12'],
    ['woodcutting-50-99','What was added to Woodcutting levels 50–99?','The 0.12 progression includes Trunk Totem, Lumber Storage, wood-weight reduction, the Lumber Backpack and a later Axtral Projection upgrade with three spectral axes.','update12'],
    ['water-magic-role','What is the role of Water Magic?','Water Magic expands the magic tree with a control identity centered on slowing enemies and water-themed utility. It complements Fire’s burning pressure and Air’s targeted knockdown role rather than replacing them.','water'],
    ['wardstones-removed','Were Wardstones and Wardshield removed?','Yes. Update 0.12 removed Wardstones and Wardshield. Damage now goes directly to health, while discovering Constitution Shrines increases the character’s maximum HP.','health'],
    ['food-healing','How does food healing work after 0.12?','Food now restores HP instantly and can provide other perks. This makes food the immediate recovery resource under the revised health model, so older Wardshield-centered survival routes are outdated.','health'],
    ['healing-potions-removed','Do healing potions still exist?','Healing potions were removed as part of the health and food rework. Stat potions remain. Players should carry suitable food instead of following old guides that depend on healing potions.','health'],
    ['agility-hotwheel-0-12-1','What combat and movement changes are announced for 0.12.1?','Jagex previewed Agility, a radial hotwheel, quick cast, in-combat rune and arrow cycling, cheaper jumps and more forgiving fall behavior. Verify the installed version before looking for these controls.','combat']
  ]},
  troubleshooting: {title:'Dedicated Servers & Troubleshooting', items:[
    ['server-supported-os','Which operating systems support dedicated servers?','The official guide requires a 64-bit operating system and supports both Windows and Linux. Home and cloud hosts remain responsible for setup, networking and backups.','server'],
    ['server-ram','How much RAM does a dedicated server need?','Jagex gives a formula of 2 GB base RAM plus 1 GB per player. That means about 4 GB for two players and 8 GB for the documented six-player maximum.','server'],
    ['server-player-limit','How many players can a dedicated server support?','The official dedicated-server guide documents support for up to six players as of update 0.11. This is separate from the four-player party wording used in general console launch messaging.','server'],
    ['server-port','Which port does a Dragonwilds dedicated server use?','The first server uses UDP port 7777 by default. A second instance uses 7778 and later instances continue upward. The chosen UDP port must pass through the host firewall and every router layer.','server'],
    ['server-required-config','Which dedicated-server settings are required?','Owner ID, Server Name, Default World Name and Admin Password are required; World Password is optional. Stop the server before editing because changes made while it runs can be lost.','server'],
    ['server-not-showing','Why is my dedicated server not showing?','First compare the complete server and client versions, then search the exact case-sensitive World Name. Confirm all mandatory settings and inspect RSDragonwilds.log before treating it as a port problem.','server'],
    ['backup-server-world','How do I back up a dedicated-server world?','Stop the server and copy the required .sav files from RSDragonwilds/Saved/Savegames to a separate protected location. Create a dated backup before updates, migrations or world replacement.','server'],
    ['tree-graphics-fix','How do I fix distorted or blooming trees?','Close the game, back up and delete Engine.ini from %localappdata%\\RSDragonwilds\\Saved\\Config\\Windows, then restart so a clean file is generated. Do not delete the entire Saved directory.','vital'],
    ['stations-splinter-server-fix','Which patch fixes disappearing stations and Splinter server crashes?','Patch 0.12.0.6 fixed crafting and processing stations disappearing on dedicated servers and the Splinter crash. Update, reload and inspect existing locations before rebuilding stations.','vital']
  ]},
  updates: {title:'Updates & Current Status', items:[
    ['current-road-to-release','What is the current road to release?','Jagex describes 0.12.1 as the final update stop before Scorned Wilderness and Kuldra arrive with the September 15 full release. Features labeled for 0.12.1 should remain separate from 1.0 features.','road'],
    ['umbral-sands-live','Is Umbral Sands available now?','Yes. Umbral Sands released with update 0.12 on June 23, 2026. It includes desert hazards, Fight Cave, Fuzan, Nightmare Crucible, Water Magic, new materials and expanded skill progression.','update12'],
    ['scorned-wilderness','What is Scorned Wilderness?','Scorned Wilderness is the announced 1.0 culmination of Kuldra’s Saga, framed as a raid through anima-damaged floating islands toward the God-Eater. Jagex is intentionally withholding major encounter spoilers.','road'],
    ['kuldra-release','When does the Kuldra encounter launch?','The official roadmap ties the Kuldra encounter and Scorned Wilderness to September 15, 2026. Exact encounter phases and drop rates should be treated as unconfirmed until the content is live.','road'],
    ['combat-rework-1-0','Which combat changes are planned for 1.0?','The preview includes improved blocking, stamina-returning parries, Visceral Attacks, animation cancelling, a special attack bar and Wands. These are announced plans, not current-build instructions.','combat'],
    ['achievements-fix','Which patch addressed achievements not unlocking?','Patch 0.12.0.1 addressed achievement triggers, while later fixes included crafting a skillcape to trigger the level-99 achievement. Earlier completed conditions were not guaranteed to unlock retroactively.','vital'],
    ['fishing-fix','Which patch fixed unusable fishing locations?','Patch 0.12.0.4 fixed various fishing locations that could not be used. If the problem persists, align the client and server versions and confirm the water interaction is a valid fishing spot.','vital'],
    ['dedicated-servers-live','Are dedicated servers available now?','Yes. The March 2026 official guide documents live partner, home and cloud hosting. Older roadmap posts that described dedicated servers as a future feature have been superseded by the setup documentation.','server']
  ]}
};

const all = Object.entries(groups).flatMap(([tab,group]) => group.items.map(item => ({tab,...{id:item[0],question:item[1],answer:item[2],source:item[3]}})));
if (all.length !== 50) throw new Error(`Expected 50 FAQs, found ${all.length}`);

const nav = `<header class="site-header"><a class="brand" href="/"><span class="brand-mark">DW</span><span>Dragonwilds Field Guide</span></a><nav aria-label="Primary navigation"><a href="/guides/">Guides</a><a href="/quests/">Quests</a><a href="/resources/">Resources</a><a href="/skills-builds/">Skills</a><a href="/troubleshooting/">Fixes</a><a href="/updates/">Updates</a><a href="/faq/" aria-current="page">FAQ</a></nav></header>`;
const schema = {'@context':'https://schema.org','@type':'FAQPage',name:'RuneScape Dragonwilds FAQ',url:`${site}/faq/`,dateModified:reviewed,mainEntity:all.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))};
const toc = Object.entries(groups).map(([tab,group])=>`<li><a href="#${tab}-faq">${group.title}</a> <span>(${group.items.length})</span></li>`).join('');
const sections = Object.entries(groups).map(([tab,group])=>`<section class="content-panel faq-group" id="${tab}-faq"><h2>${group.title}</h2>${group.items.map(([id,q,a,s])=>`<details class="faq-item" id="${id}"><summary><h3>${q}</h3></summary><div><p>${a}</p><p class="faq-source"><a href="${sources[s][1]}" rel="noopener noreferrer">Source: ${sources[s][0]}</a> · Reviewed ${reviewed}</p><p><a href="#${id}" aria-label="Permanent link to ${q}">Copyable question link: #${id}</a></p></div></details>`).join('')}</section>`).join('');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RuneScape Dragonwilds FAQ: 50 Verified Answers</title><meta name="description" content="Fifty verified RuneScape Dragonwilds answers covering release dates, platforms, quests, crafting, skills, servers, known issues and current updates."><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${site}/faq/"><meta property="og:type" content="website"><meta property="og:title" content="RuneScape Dragonwilds FAQ: 50 Verified Answers"><meta property="og:description" content="Official-source answers for the questions Dragonwilds players ask about release, progression, servers and fixes."><meta property="og:url" content="${site}/faq/"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body>${nav}<main class="page-main"><article><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><span>FAQ</span></nav><p class="eyebrow">Verified player questions</p><h1>RuneScape: Dragonwilds FAQ</h1><section class="quick-answer"><h2>50 direct answers</h2><p><strong>Every answer below is tied to an official Jagex announcement, live issue page, server guide or Steam listing.</strong> Future features are labelled as announced; live fixes include the relevant patch number.</p></section><section class="content-panel"><h2>Browse by topic</h2><ul class="faq-toc">${toc}</ul></section>${sections}<aside class="source-box"><h2>Editorial boundary</h2><p>FAQPage structured data helps machines understand the question-and-answer format but does not guarantee a Google rich result. Answers are updated when official evidence changes; unannounced mechanics, invented drop rates and speculative release claims are excluded.</p></aside></article></main><footer class="site-footer"><p><strong>Dragonwilds Field Guide</strong> is an unofficial fan resource and is not affiliated with Jagex.</p><p><a href="/about/">Editorial policy</a> · <a href="/sitemap.xml">Sitemap</a> · Reviewed ${reviewed}</p></footer></body></html>`;
fs.mkdirSync(path.join(root,'faq'),{recursive:true});
fs.writeFileSync(path.join(root,'faq','index.html'),html);

for (const [tab,group] of Object.entries(groups)) {
  const links = group.items.map(([id,q])=>`<li><a href="/faq/#${id}">${q}</a></li>`).join('');
  const block = `<!-- RELATED_FAQ_START --><section class="content-panel related-faq" id="related-faq"><h2>Related ${group.title} FAQ</h2><p>Direct, official-source answers for this topic:</p><ul>${links}</ul><p><a href="/faq/">Browse all 50 Dragonwilds FAQ answers →</a></p></section><!-- RELATED_FAQ_END -->`;
  const file = path.join(root,tab,'index.html');
  let hub = fs.readFileSync(file,'utf8').replace(/\s*<!-- RELATED_FAQ_START -->[\s\S]*?<!-- RELATED_FAQ_END -->/g,'');
  hub = hub.replace('</article>',`${block}</article>`);
  fs.writeFileSync(file,hub);

  for (const lang of ['de','fr']) {
    const localized = path.join(root,lang,tab,'index.html');
    if(!fs.existsSync(localized)) continue;
    const label = lang==='de'?'Verwandte FAQ auf Englisch':'FAQ associée en anglais';
    const localBlock = `<!-- RELATED_FAQ_START --><section class="content-panel related-faq" id="related-faq"><h2>${label}</h2><ul>${group.items.map(([id,q])=>`<li><a href="/faq/#${id}" hreflang="en">${q}</a></li>`).join('')}</ul></section><!-- RELATED_FAQ_END -->`;
    let localHtml=fs.readFileSync(localized,'utf8').replace(/\s*<!-- RELATED_FAQ_START -->[\s\S]*?<!-- RELATED_FAQ_END -->/g,'');
    localHtml=localHtml.replace('</article>',`${localBlock}</article>`);
    fs.writeFileSync(localized,localHtml);
  }
}

console.log(`Generated ${all.length} verified FAQs and related entry links across ${Object.keys(groups).length} hubs.`);
