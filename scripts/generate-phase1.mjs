import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://runescapedragonwilds.wiki';
const updated = '2026-07-17';

const nav = `
  <header class="site-header">
    <a class="brand" href="/"><span class="brand-mark">DW</span><span>Dragonwilds Field Guide</span></a>
    <nav aria-label="Primary navigation">
      <a href="/guides/">Guides</a><a href="/quests/">Quests</a><a href="/resources/">Resources</a>
      <a href="/skills-builds/">Skills</a><a href="/map/">Map</a><a href="/updates/">Updates</a>
    </nav>
  </header>`;

const footer = `
  <footer class="site-footer">
    <p><strong>Dragonwilds Field Guide</strong> is an unofficial fan resource and is not affiliated with Jagex.</p>
    <p><a href="/about/">Editorial policy</a> · <a href="/sitemap.xml">Sitemap</a> · Content reviewed ${updated}</p>
  </footer>`;

const sourceLinks = {
  steam: ['Steam store listing', 'https://store.steampowered.com/app/1374490/RuneScape_Dragonwilds/'],
  console: ['Official console release announcement', 'https://dragonwilds.runescape.com/news/console-release-date'],
  update12: ['Official 0.12.0 update overview', 'https://dragonwilds.runescape.com/news/eye-on-ashenfall-0.12.0'],
  roadmap: ['Official Kuldra’s Saga roadmap', 'https://dragonwilds.runescape.com/news/kuldras-saga-the-roadmap-update'],
  news: ['Official Dragonwilds news', 'https://dragonwilds.runescape.com/news'],
  update11: ['Official 0.11 development update', 'https://dragonwilds.runescape.com/news/update-on-0.11']
};

function sourceBox(keys) {
  const links = keys.map((key) => `<li><a href="${sourceLinks[key][1]}" rel="noopener noreferrer">${sourceLinks[key][0]}</a></li>`).join('');
  return `<aside class="source-box" aria-label="Sources"><h2>Sources and verification</h2><p>This page separates confirmed details from advice. Official facts were checked on ${updated}.</p><ul>${links}</ul></aside>`;
}

function page({ slug, title, description, eyebrow, h1, answer, sections, sources, related }) {
  const url = `${site}/${slug}/`;
  const crumbs = slug.split('/').map((part) => part.replaceAll('-', ' '));
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
    ...crumbs.map((name, index) => ({ '@type': 'ListItem', position: index + 2, name, item: `${site}/${slug.split('/').slice(0, index + 1).join('/')}/` }))
  ];
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Article', headline: h1, description, dateModified: updated, mainEntityOfPage: url, author: { '@type': 'Organization', name: 'Dragonwilds Field Guide' } },
      { '@type': 'BreadcrumbList', itemListElement: breadcrumbItems }
    ]
  };
  const relatedHtml = related?.length ? `<section class="content-panel"><h2>Related Dragonwilds guides</h2><ul>${related.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></section>` : '';
  return `<!doctype html>
<html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title><meta name="description" content="${description}"><meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${url}"><meta property="og:type" content="article"><meta property="og:title" content="${h1}">
  <meta property="og:description" content="${description}"><meta property="og:url" content="${url}">
  <link rel="icon" href="/favicon.ico" sizes="any"><link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head><body>${nav}
<main class="page-main"><article>
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><span>${h1}</span></nav>
  <p class="eyebrow">${eyebrow}</p><h1>${h1}</h1>
  <section class="quick-answer"><h2>Quick answer</h2>${answer}</section>
  ${sections.join('\n')}
  ${sourceBox(sources)}${relatedHtml}
</article></main>${footer}</body></html>`;
}

const panel = (heading, html) => `<section class="content-panel"><h2>${heading}</h2>${html}</section>`;

const pages = [
  {
    slug: 'release-date', title: 'RuneScape Dragonwilds Release Date: 1.0 on September 15, 2026',
    description: 'RuneScape Dragonwilds leaves Early Access on September 15, 2026. See the confirmed PC and console release status and what changes at 1.0.',
    eyebrow: 'Release status', h1: 'RuneScape: Dragonwilds Release Date',
    answer: '<p><strong>RuneScape: Dragonwilds entered Steam Early Access on April 15, 2025. Jagex has announced that version 1.0 and the console release are scheduled for September 15, 2026.</strong> The game remains playable on PC before that date.</p>',
    sections: [
      panel('Release timeline', '<ul><li><strong>April 15, 2025:</strong> Steam Early Access launch.</li><li><strong>June 23, 2026:</strong> Umbral Sands major update.</li><li><strong>September 15, 2026:</strong> announced 1.0 launch on PC and consoles.</li></ul><p>The September release is tied to the Scorned Wilderness update and the final confrontation in Kuldra’s Saga. Treat the date as an announced schedule: release plans can still change, so this page links the official announcement below.</p>'),
      panel('What players can do now', '<p>The PC Early Access build already includes solo play, online co-op, multiple regions, skill progression, base building, combat, Fishing, dedicated servers and the Umbral Sands content. Buying the Early Access version is not the same as waiting for an unavailable game: it is a live, evolving build.</p><p>If you are waiting for console, use the platform guide for the confirmed systems. If you already play on Steam, the updates hub tracks major gameplay changes that affect guides and recipes.</p>')
    ], sources: ['steam', 'console'], related: [['Console release guide', '/consoles/'], ['Current updates', '/updates/'], ['Game overview', '/game-info/']]
  },
  {
    slug: 'consoles', title: 'RuneScape Dragonwilds Console Release: PS5, Xbox & Switch 2',
    description: 'RuneScape Dragonwilds is coming to consoles on September 15, 2026. Check the confirmed PS5, Xbox and Switch 2 release information.',
    eyebrow: 'Platforms', h1: 'RuneScape: Dragonwilds on Console',
    answer: '<p><strong>Jagex has announced a September 15, 2026 console launch alongside version 1.0.</strong> The official announcement names PC and consoles, while a separate announcement specifically confirms Nintendo Switch 2.</p>',
    sections: [
      panel('Confirmed console information', '<p>The June 2026 announcement connects the console release to the Scorned Wilderness update and the end of the current Early Access saga. It also says the release will bring the game to “all platforms.” Nintendo Switch 2 is separately confirmed by Jagex. Store availability, editions and exact platform feature parity should be checked again when platform product pages go live.</p>'),
      panel('Crossplay and save transfer', '<p>Do not assume crossplay or cross-save merely because several platforms release on the same date. The current official release announcement confirms the launch window, but players should wait for explicit platform-service details before planning a shared world across PC and console. This guide will separate crossplay, cross-save and dedicated-server compatibility once Jagex publishes those specifications.</p>'),
      panel('Before buying', '<ul><li>Confirm the product page for your exact console.</li><li>Check whether your co-op group needs crossplay.</li><li>Review dedicated-server support separately from peer-hosted co-op.</li><li>Do not buy a PC server rental assuming it will accept console clients.</li></ul>')
    ], sources: ['console', 'news'], related: [['Switch 2 release', '/switch-2/'], ['Dedicated servers', '/dedicated-servers/'], ['Release date', '/release-date/']]
  },
  {
    slug: 'switch-2', title: 'RuneScape Dragonwilds Switch 2 Release Date & Status',
    description: 'RuneScape Dragonwilds is officially confirmed for Nintendo Switch 2. See the September 15, 2026 release status and unanswered feature questions.',
    eyebrow: 'Nintendo', h1: 'RuneScape: Dragonwilds on Switch 2',
    answer: '<p><strong>RuneScape: Dragonwilds is officially coming to Nintendo Switch 2 as part of the September 15, 2026 version 1.0 console launch.</strong> Jagex announced Switch 2 separately in June 2026.</p>',
    sections: [
      panel('What is confirmed', '<p>The confirmed points are the platform, the broader September 15 launch date and the fact that the console release accompanies the Scorned Wilderness/1.0 milestone. Details such as resolution targets, performance modes, local save behavior, crossplay and server compatibility require their own confirmation.</p>'),
      panel('What is not yet safe to assume', '<ul><li>Crossplay with Steam players.</li><li>Cross-progression between PC and Switch 2.</li><li>Support for the PC dedicated-server tool.</li><li>Exact frame-rate or handheld battery targets.</li></ul><p>Those are distinct technical features, not automatic consequences of a multiplatform release. This page deliberately avoids filling gaps with speculation.</p>')
    ], sources: ['console', 'news'], related: [['All console platforms', '/consoles/'], ['Release date', '/release-date/'], ['Co-op guide', '/co-op/']]
  },
  {
    slug: 'umbral-sands', title: 'RuneScape Dragonwilds Umbral Sands Guide: Access, Hazards & Gear',
    description: 'Umbral Sands guide covering how to unlock the region, Sunscorch, quicksand, Fuzan, Fight Cave, Nightmare Crucible and new gear tiers.',
    eyebrow: 'Region guide', h1: 'Umbral Sands Guide',
    answer: '<p><strong>Umbral Sands is the desert region added in update 0.12.0 on June 23, 2026.</strong> Defeat the Black Knight Titan to pass the gate, then prepare for Sunscorch, quicksand, three new vaults, the Fight Cave, Fuzan and the Nightmare Crucible.</p>',
    sections: [
      panel('Entry requirement and route', '<p>The official update states that the Black Knight Titan must be defeated before the gate into Umbral Sands opens. Treat that boss as the progression check: arrive with repaired gear, healing supplies, hydration support and free inventory space rather than discovering the requirement in the middle of a long resource run.</p>'),
      panel('Environmental hazards', '<p><strong>Sunscorch</strong> builds during prolonged sun exposure and its Scorch debuff rapidly drains hydration. Use shelter and shade, or travel during dawn and dusk. <strong>Quicksand</strong> blocks unsafe ground and requires a way over it, so route planning matters as much as combat power.</p>'),
      panel('Major progression targets', '<ul><li>Complete Moon Garou quests for resources, rewards and cosmetics.</li><li>Clear the Fight Cave to challenge Fuzan.</li><li>Find Engrams to access the Nightmare Crucible boss-rush challenge.</li><li>Gather Adamant Ore, Yew Wood and Red Dragonhide for the next gear tier.</li><li>Explore the region’s three new vaults.</li></ul>')
    ], sources: ['update12'], related: [['Sunscorch survival', '/sunscorch/'], ['Fuzan guide', '/fuzan/'], ['Adamant gear', '/adamant-gear/'], ['Nightmare Crucible', '/nightmare-crucible/']]
  },
  {
    slug: 'sunscorch', title: 'Dragonwilds Sunscorch: How the Umbral Sands Hazard Works',
    description: 'Learn how Sunscorch and the Scorch debuff work in Umbral Sands, plus the confirmed ways to reduce exposure and protect hydration.',
    eyebrow: 'Survival mechanic', h1: 'How to Survive Sunscorch',
    answer: '<p><strong>Sunscorch is caused by prolonged exposure to the Umbral Sands sun. Once Scorch is applied, hydration drains rapidly.</strong> The confirmed counters are shelter, shade and travelling during dawn or dusk.</p>',
    sections: [
      panel('Safe travel plan', '<ol><li>Fill hydration before leaving a protected area.</li><li>Mark nearby shade or player-built shelter before committing to a long route.</li><li>Travel at dawn or dusk when the sun is less punishing.</li><li>Turn back before Scorch and combat damage combine into an unrecoverable run.</li></ol>'),
      panel('Why preparation matters', '<p>Sunscorch is a route-management problem. Carrying better weapons does not replace cover or hydration. When farming Adamant or Yew, plan a repeatable loop with safe pauses instead of following a straight line across open sand. If a fight begins while hydration is collapsing, reposition into shade before trying to finish a long encounter.</p>')
    ], sources: ['update12'], related: [['Umbral Sands overview', '/umbral-sands/'], ['Quicksand', '/quicksand/'], ['Survival systems', '/survival-systems/']]
  },
  {
    slug: 'quicksand', title: 'Dragonwilds Quicksand Guide: Umbral Sands Route Safety',
    description: 'A concise guide to quicksand in RuneScape Dragonwilds Umbral Sands, what the hazard does and how to plan safer traversal routes.',
    eyebrow: 'Environmental hazard', h1: 'Umbral Sands Quicksand',
    answer: '<p><strong>Quicksand is treacherous ground in Umbral Sands that can pull in players who misstep.</strong> The official update says players need to find a way over these areas; approach them as route obstacles, not normal sand.</p>',
    sections: [
      panel('Traversal checklist', '<ul><li>Stop sprinting when terrain changes and scan for a safe crossing.</li><li>Do not enter an unfamiliar patch while Sunscorch or enemies are already pressuring you.</li><li>Keep enough stamina and supplies to retreat.</li><li>Record a known crossing for future Adamant, Yew or quest runs.</li></ul>'),
      panel('Common route mistake', '<p>The costly mistake is treating every direct line on the map as walkable. Umbral Sands combines quicksand with heat pressure, so a slightly longer route through reliable cover can be faster than recovering lost gear or supplies. Exact crossings may change with patches; verify the path in the current build before documenting a permanent farming route.</p>')
    ], sources: ['update12'], related: [['Umbral Sands guide', '/umbral-sands/'], ['Sunscorch', '/sunscorch/'], ['Map hub', '/map/']]
  },
  {
    slug: 'fuzan', title: 'Fuzan Boss Guide: How to Unlock the Fight in Dragonwilds',
    description: 'Fuzan is the Dragon General of Umbral Sands. Learn the confirmed unlock requirement, Fight Cave connection and preparation route.',
    eyebrow: 'Boss unlock', h1: 'Fuzan Boss Guide',
    answer: '<p><strong>Fuzan is the new Dragon General in Umbral Sands. Complete the region questline and clear the Fight Cave to earn the right to challenge Fuzan.</strong> The Fight Cave is repeatable for additional rewards.</p>',
    sections: [
      panel('Unlock order', '<ol><li>Defeat the Black Knight Titan and enter Umbral Sands.</li><li>Progress the region questline and Moon Garou content.</li><li>Reach and complete the Fight Cave challenge.</li><li>Use the victory to proceed to Fuzan.</li></ol>'),
      panel('Preparation priorities', '<p>Prepare for the entire chain rather than only the final boss. Repair equipment, bring sustainable healing and hydration, and leave inventory room for rewards. Umbral Sands adds Adamant, Yew and Red Dragonhide progression, but this page does not claim a single mandatory build without verified combat testing. Strategy details such as exact weaknesses, attack timings and solo-versus-group scaling should be updated from the current game build.</p>')
    ], sources: ['update12'], related: [['Fight Cave', '/fight-cave/'], ['Umbral Sands', '/umbral-sands/'], ['Boss preparation', '/boss-prep/']]
  },
  {
    slug: 'fight-cave', title: 'Dragonwilds Fight Cave Guide: Unlock Fuzan & Repeat Rewards',
    description: 'The Umbral Sands Fight Cave unlocks the Fuzan encounter and can be repeated for rewards. See the confirmed progression and prep checklist.',
    eyebrow: 'Combat challenge', h1: 'Fight Cave Guide',
    answer: '<p><strong>The Fight Cave is an Umbral Sands combat challenge at the end of the region questline.</strong> Clearing it earns the right to challenge Fuzan, and the activity can be repeated for additional rewards including rare materials.</p>',
    sections: [
      panel('Before entering', '<ul><li>Finish required region quests before assuming the arena is available.</li><li>Repair your primary weapon and armour.</li><li>Bring food, drink and a backup damage option.</li><li>Clear unnecessary inventory slots for rewards.</li><li>Set a nearby recovery route before the attempt.</li></ul>'),
      panel('Fight Cave versus Nightmare Crucible', '<p>These are separate Umbral Sands activities. The Fight Cave gates the Fuzan confrontation. The Nightmare Crucible is a boss-rush style challenge unlocked with Engrams and rewards Ascension Cores. Searching for one activity should not land players on a generic dungeon page that merges both progression paths.</p>')
    ], sources: ['update12'], related: [['Fuzan', '/fuzan/'], ['Nightmare Crucible', '/nightmare-crucible/'], ['Dungeons and vaults', '/dungeons-vaults/']]
  },
  {
    slug: 'nightmare-crucible', title: 'Nightmare Crucible Guide: Engrams & Ascension Cores',
    description: 'Find out how the Nightmare Crucible works in Dragonwilds, what Engrams unlock and why Ascension Cores matter for future upgrades.',
    eyebrow: 'Boss rush', h1: 'Nightmare Crucible Guide',
    answer: '<p><strong>Find Engrams around Umbral Sands to gain access to the Nightmare Crucible.</strong> It is a boss-rush style challenge that rewards rare Ascension Cores, which are intended for powerful upgrades connected to the Scorned Wilderness release.</p>',
    sections: [
      panel('How access works', '<p>Engrams are the access requirement named in the official 0.12.0 overview. Gather them while exploring Umbral Sands rather than arriving at the challenge with no unlock progress. Because the activity reuses dangerous enemies from across Ashenfall, prepare for varied encounters instead of optimizing for one boss only.</p>'),
      panel('Reward planning', '<p>Ascension Cores are progression materials, not ordinary crafting clutter. Store them safely and avoid spending plans based on unconfirmed recipes before the Scorned Wilderness upgrade system is fully documented. A future patch may clarify quantities and upgrade paths, so this page should be rechecked after every major update.</p>')
    ], sources: ['update12', 'roadmap'], related: [['Umbral Sands', '/umbral-sands/'], ['Fight Cave', '/fight-cave/'], ['Scorned Wilderness roadmap', '/early-access-roadmap/']]
  },
  {
    slug: 'adamant-gear', title: 'Dragonwilds Adamant Gear: Weapons, Tools, Armour & Ammo',
    description: 'Adamant Ore in Umbral Sands unlocks a new crafting tier with four tools, eight weapon types, armour, a shield and ranged ammunition.',
    eyebrow: 'Gear database', h1: 'Adamant Gear Overview',
    answer: '<p><strong>Adamant Ore is available in Umbral Sands and supports a new equipment tier.</strong> The official update lists four tools, eight weapon types, one armour set, one shield and Adamant ammunition.</p>',
    sections: [
      panel('Confirmed Adamant equipment', '<h3>Tools</h3><ul><li>Spade</li><li>Watering Can</li><li>Pickaxe</li><li>Logging Axe</li></ul><h3>Weapons</h3><ul><li>Crossbow</li><li>Dagger</li><li>Greataxe</li><li>Greatsword</li><li>Hammer</li><li>Mace</li><li>Scimitar</li><li>Sword</li></ul><p>The tier also includes an armour set, shield and ranged ammunition. Exact ingredient quantities belong on individual recipe pages only after they are verified in the current build.</p>'),
      panel('Crafting station change', '<p>Umbral Sands reorganized equipment crafting: melee weapons and tools use the Blacksmith’s Bench, ranged weaponry uses the Fletching Bench, magic weapons and Vestiges use the Mystic Forge, and armour sets use the Armour Bench. Check the new station before assuming an older recipe disappeared.</p>')
    ], sources: ['update12'], related: [['Crafting stations', '/crafting-stations/'], ['Umbral Sands', '/umbral-sands/'], ['Weapons and armour', '/weapons-armor/']]
  },
  {
    slug: 'yew-wood', title: 'Dragonwilds Yew Wood Uses: Bow, Crossbow Stock & Fishing Rod',
    description: 'Yew Wood is found across Umbral Sands and is used for the Yew Fishing Rod, Yew Shortbow, Yew Longbow and Yew Crossbow Stock.',
    eyebrow: 'Resource guide', h1: 'Yew Wood Uses and Progression',
    answer: '<p><strong>Yew Wood can be found across Umbral Sands.</strong> Confirmed Yew crafts include the Yew Fishing Rod, Yew Shortbow, Yew Longbow and Yew Stock used for a crossbow.</p>',
    sections: [
      panel('Why Yew matters', '<p>Yew links gathering to both Fishing and ranged progression, so it should not be treated as a single-use building material. Plan gathering trips around shade and hydration because Umbral Sands travel exposes players to Sunscorch. Store enough wood for the desired weapon and replacement needs before converting every log into one item type.</p>'),
      panel('Recipe verification rule', '<p>This page intentionally lists confirmed outputs without inventing ingredient counts. Each recipe URL should be published only when the crafting station, full ingredient list, unlock condition and current patch are verified. Ranged weapon recipes belong with the Fletching Bench after the 0.12 station rework.</p>')
    ], sources: ['update12'], related: [['Umbral Sands', '/umbral-sands/'], ['Fishing', '/fishing/'], ['Resources', '/resources/']]
  },
  {
    slug: 'red-dragonhide', title: 'Dragonwilds Red Dragonhide Armour: How the Tier Works',
    description: 'Red Dragonhide can be tanned and crafted into armour in Dragonwilds Umbral Sands. See its confirmed role and crafting station context.',
    eyebrow: 'Ranged armour', h1: 'Red Dragonhide Armour',
    answer: '<p><strong>Red Dragonhide is a new Umbral Sands material that can be tanned and crafted into Red Dragonhide armour.</strong> Armour crafting now belongs at the Armour Bench after the 0.12 station reorganization.</p>',
    sections: [
      panel('Progression context', '<p>Red Dragonhide sits alongside Adamant equipment, Infinity Robes and four Vestige armour sets in the Umbral Sands gear expansion. It is positioned as ranged-oriented equipment, while the official post separately lists Kalphite Carapace as the ranged Vestige set.</p>'),
      panel('Before publishing recipes', '<p>A useful recipe page must verify the hide source, tanning step, station, quantities, unlock condition and resulting stats. Until those values are checked in the live build, a material overview is safer than multiple thin pages with guessed numbers. Use the Armour Bench when looking for the craft after the station migration.</p>')
    ], sources: ['update12'], related: [['Crafting stations', '/crafting-stations/'], ['Adamant gear', '/adamant-gear/'], ['Weapons and armour', '/weapons-armor/']]
  },
  {
    slug: 'crafting-stations', title: 'Dragonwilds Crafting Stations After Update 0.12',
    description: 'Find the correct station after the Dragonwilds crafting rework: Blacksmith’s Bench, Fletching Bench, Mystic Forge and Armour Bench.',
    eyebrow: 'Crafting update', h1: 'New Crafting Stations Explained',
    answer: '<p><strong>Update 0.12 split equipment crafting across four specialized stations:</strong> Blacksmith’s Bench for tools and melee weapons, Fletching Bench for ranged weapons, Mystic Forge for magic weapons and Vestiges, and Armour Bench for armour sets.</p>',
    sections: [
      panel('Station lookup', '<div class="table-wrap"><table><thead><tr><th>Station</th><th>Primary use</th></tr></thead><tbody><tr><td>Blacksmith’s Bench</td><td>Tools and melee weapons</td></tr><tr><td>Fletching Bench</td><td>All ranged weaponry</td></tr><tr><td>Mystic Forge</td><td>Magic weapons and Vestiges</td></tr><tr><td>Armour Bench</td><td>All armour sets</td></tr></tbody></table></div>'),
      panel('What happened to old stations', '<p>The official update warned that existing crafting stations would be deleted on first login after the change and their components refunded. Replace the stations in your crafting room rather than assuming the save lost materials. The update also adds Ore & Stone Storage at Mining level 59 and Lumber Storage at Woodcutting level 59.</p>')
    ], sources: ['update12'], related: [['Recipes hub', '/recipes/'], ['Adamant gear', '/adamant-gear/'], ['Base building', '/base-building/']]
  },
  {
    slug: 'dedicated-servers', title: 'RuneScape Dragonwilds Dedicated Servers: Players & Setup Facts',
    description: 'RuneScape Dragonwilds dedicated servers support up to six players. Learn the confirmed Steam tool, admin controls and hosting context.',
    eyebrow: 'Multiplayer hosting', h1: 'Dedicated Servers Guide',
    answer: '<p><strong>Dragonwilds dedicated servers were introduced as a separate free Steam product and support up to six players.</strong> Jagex’s development update also described admin controls for kicking, banning and unbanning users.</p>',
    sections: [
      panel('Dedicated versus normal co-op', '<p>A dedicated server keeps world hosting separate from one player’s normal game session. That is useful for groups with different schedules, but it also introduces server administration, backups and version compatibility. Do not confuse the six-player dedicated-server cap with every peer-hosted session mode.</p>'),
      panel('Before choosing a host', '<ul><li>Confirm the current server tool version matches the game build.</li><li>Assign more than one trusted admin.</li><li>Plan backups before major updates.</li><li>Check console compatibility again at the September launch rather than assuming it.</li><li>Keep passwords and admin access outside public posts.</li></ul>')
    ], sources: ['update11', 'console'], related: [['Co-op guide', '/co-op/'], ['Console release', '/consoles/'], ['Platforms', '/platforms/']]
  },
  {
    slug: 'water-magic', title: 'Dragonwilds Water Magic: Umbral Sands Skill Update',
    description: 'Water Magic arrived with Dragonwilds update 0.12 and Umbral Sands. See where it fits in the skill and desert survival progression.',
    eyebrow: 'Magic update', h1: 'Water Magic Overview',
    answer: '<p><strong>Water Magic arrived with the Umbral Sands 0.12 update in June 2026.</strong> It expands magic progression alongside the desert region, new gear, spells and higher-level skill content.</p>',
    sections: [
      panel('What is confirmed', '<p>The official 0.12 announcement includes Water Magic among the major update features and expands Woodcutting and Mining skill trees to level 99 with new spells, recipes, perks and rewards. The region also adds magic-oriented Infinity Robes plus Lunar Garou and Desert Robes Vestige sets.</p>'),
      panel('How this page will expand', '<p>Individual spell pages should only be indexed after their name, level requirement, rune or resource cost, effect and practical use are verified. That creates useful search answers instead of dozens of near-empty “spell database” URLs. Until then, use this hub to connect the confirmed update with Anima Magic and Umbral Sands progression.</p>')
    ], sources: ['update12', 'news'], related: [['Anima Magic', '/anima-magic/'], ['Umbral Sands', '/umbral-sands/'], ['Skills and builds', '/skills-builds/']]
  }
];

for (const entry of pages) {
  const target = path.join(root, entry.slug, 'index.html');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, page(entry));
}

const hubEnhancements = {
  'about': panel('How pages qualify for indexing', '<p>This guide uses official announcements for release and update facts, then adds player-focused planning only where it can answer a concrete question. Database candidates with unknown locations, quantities, stats or quest steps stay outside the sitemap until they are verified.</p><p>Every indexed expansion page should state when it was reviewed, link its sources, connect to a useful hub and avoid presenting this fan site as an official Jagex property.</p>'),
  'anima-magic': panel('Current magic progression', '<p>Water Magic arrived with the Umbral Sands 0.12 update, while the region also introduced Infinity Robes and two magic-oriented Vestige sets: Lunar Garou and Desert Robes. Magic pages should connect each spell to its level, cost, effect and practical use rather than publishing name-only entries.</p><p>Use the <a href="/water-magic/">Water Magic overview</a> for the current update context. Future spell pages will be added only after their unlock requirements and effects are verified in the live build.</p>'),
  'base-building': panel('Important 0.12 base change', '<p>Update 0.12 reorganized equipment crafting across the Blacksmith’s Bench, Fletching Bench, Mystic Forge and Armour Bench. Existing stations were removed on first login after the update with their components refunded, so players need to rebuild the stations rather than searching an old bench for a missing recipe.</p><p>Mining level 59 unlocks Ore & Stone Storage, while Woodcutting level 59 unlocks Lumber Storage. See the <a href="/crafting-stations/">crafting station lookup</a> before redesigning a workshop.</p>'),
  'beginner-guide': panel('Where this route leads next', '<p>New players begin in a much larger Early Access build than the 2025 launch version. Progression now extends through Fellhollow, Dowdun Reach and Umbral Sands, with Fishing, dedicated servers and skill caps up to 99. Do not rush directly toward late regions: establish food, storage, repaired equipment and a short return loop first.</p><p>Before Umbral Sands, defeat the Black Knight Titan and prepare for hydration pressure. The desert adds Sunscorch and quicksand, so base supplies and route knowledge remain useful even when combat gear improves.</p>'),
  'boss-prep': panel('Current endgame targets', '<p>Umbral Sands adds three distinct combat goals: the Fight Cave, Fuzan and the Nightmare Crucible. The Fight Cave is tied to the region questline and unlocks the Fuzan confrontation. The Nightmare Crucible instead uses Engrams for access and awards Ascension Cores for later progression.</p><p>Prepare for the full route, not only one health bar. Repair gear, protect hydration, bring a backup damage option and leave room for rewards. See the <a href="/fuzan/">Fuzan unlock guide</a> and <a href="/nightmare-crucible/">Nightmare Crucible guide</a>.</p>'),
  'co-op': panel('Dedicated server option', '<p>Dragonwilds supports a separate dedicated-server tool on Steam with up to six players and admin controls. This is useful for groups that do not want world availability tied to one host’s play session. Back up the world before major updates and keep the server build aligned with the client build.</p><p>Console compatibility should be rechecked at the September 15 launch instead of assumed. See the <a href="/dedicated-servers/">dedicated servers guide</a> for the confirmed facts and setup checklist.</p>'),
  'crafting-resources': panel('Current top-tier material loop', '<p>Umbral Sands adds Adamant Ore, Yew Wood and Red Dragonhide as major progression materials. Adamant supports tools, melee and ranged equipment; Yew supports a fishing rod and ranged weapon components; Red Dragonhide can be tanned into armour. The 0.12 crafting-station rework also changes where players make this equipment.</p><p>Use the <a href="/adamant-gear/">Adamant equipment list</a>, <a href="/yew-wood/">Yew uses</a> and <a href="/crafting-stations/">station lookup</a> before planning a long farming run.</p>'),
  'dungeons-vaults': panel('Umbral Sands activities', '<p>Update 0.12 adds three vaults in Umbral Sands plus two larger repeatable combat activities. The Fight Cave gates the Fuzan boss encounter. The Nightmare Crucible is a separate boss-rush challenge accessed with Engrams and rewards Ascension Cores.</p><p>These activities need separate pages because their access requirements and rewards answer different searches. Start with the <a href="/fight-cave/">Fight Cave guide</a> or <a href="/nightmare-crucible/">Nightmare Crucible guide</a>; individual vault routes will be published after their entrances, objectives and rewards are verified.</p>'),
  'early-access-roadmap': panel('Confirmed 2026 milestone', '<p>Jagex has announced September 15, 2026 for version 1.0 and the console launch. The release is connected to Scorned Wilderness, Runite-tier progression and the climax of Kuldra’s Saga. Agility is planned as a traversal skill, while Prayer is described as a later combat and support skill.</p><p>The May roadmap says there will be no August minor update while the team focuses on Scorned Wilderness and additional platforms. Dates and scope remain patch-sensitive; use the <a href="/release-date/">release-date tracker</a> for the latest confirmed status.</p>'),
  'fishing': panel('Fishing is now live', '<p>Fishing was separated from the March 0.11 release and delivered with the April anniversary update. The skill includes fish to catch and cook, skill progression and related equipment. Umbral Sands later added a Yew Fishing Rod, connecting high-level Woodcutting resources to Fishing progression.</p><p>Exact fish locations, bait, levels and recipes should be verified per patch before separate database URLs are indexed. Until that dataset is ready, use the <a href="/yew-wood/">Yew Wood guide</a> for the confirmed late-region equipment link.</p>'),
  'faq': panel('Current fast answers', '<ul><li><strong>Is the game playable?</strong> Yes, on PC through Steam Early Access.</li><li><strong>When is 1.0?</strong> Jagex announced September 15, 2026.</li><li><strong>Is a console version confirmed?</strong> Yes, including Nintendo Switch 2.</li><li><strong>What is the latest major region?</strong> Umbral Sands, added in update 0.12.</li><li><strong>Are dedicated servers available?</strong> Yes, with support for up to six players.</li></ul><p>Use the linked topic pages for source-backed detail rather than relying on an answer that may change after a patch.</p>'),
  'game-info': panel('Current build at a glance', '<p>The live Early Access game has expanded beyond its April 2025 launch with Fellhollow, Dowdun Reach and Umbral Sands. Current systems include Fishing, dedicated servers, skill caps up to 99, new crafting stations, Water Magic, Steam Achievements and several late-game combat activities.</p><p>The announced next milestone is September 15, 2026, when Jagex plans to release version 1.0, Scorned Wilderness and console versions. See the <a href="/release-date/">release tracker</a> and <a href="/updates/">update hub</a> for details.</p>'),
  'guides': panel('Start from the current patch', '<p>For the June 2026 build, the highest-priority routes are Umbral Sands access and survival, the Fight Cave to Fuzan chain, Nightmare Crucible Engrams, and the reorganized crafting stations. Platform readers should use the release, console and dedicated-server pages rather than a generic game overview.</p><p>New database pages are added to this index only after the location, recipe, stats or steps can be verified. This prevents search results from landing on placeholder templates.</p>'),
  'map': panel('Current region coverage', '<p>Dragonwilds progression now spans the original Ashenfall areas plus Fellhollow, Dowdun Reach and Umbral Sands. The desert region requires the Black Knight Titan to be defeated and adds Sunscorch, quicksand, three vaults, the Fight Cave and Nightmare Crucible.</p><p>A map page is only useful when a marker has a verified location and patch. The first expansion batch should prioritize region gates, quest objectives, Engrams, bosses and high-demand materials. Start with the <a href="/umbral-sands/">Umbral Sands region guide</a> for access and hazard context.</p>'),
  'platforms': panel('Current platform status', '<p>The game is playable through Steam Early Access on PC. Jagex has announced version 1.0 and the console launch for September 15, 2026, with Nintendo Switch 2 specifically confirmed. Crossplay, cross-save and dedicated-server compatibility are separate questions and should not be inferred from the shared release date.</p><p>See the <a href="/consoles/">console overview</a>, <a href="/switch-2/">Switch 2 status</a> and <a href="/dedicated-servers/">server guide</a> for answers scoped to one intent.</p>'),
  'quests': panel('Verified current quest clusters', '<p>Umbral Sands contains a regional questline that leads to the Fight Cave and Fuzan, while Moon Garou quests unlock resources, rewards and cosmetics. The official roadmap also describes monthly minor updates as a source of additional quests and activities.</p><p>Each walkthrough must include the start condition, required items, exact objectives, route, rewards and stuck-point fixes. The first verified branch is the <a href="/fuzan/">Fuzan unlock path</a>. Name-only quest pages remain outside the sitemap until their steps can answer a real player problem.</p>'),
  'recipes': panel('Find the correct crafting station', '<p>After update 0.12, tools and melee weapons use the Blacksmith’s Bench; ranged weapons use the Fletching Bench; magic weapons and Vestiges use the Mystic Forge; and armour sets use the Armour Bench. A player who cannot find an old recipe should check the new specialized station first.</p><p>Recipe URLs will require a complete ingredient list, station, unlock condition, resulting item and current patch. See the <a href="/crafting-stations/">station lookup</a> and <a href="/adamant-gear/">Adamant equipment overview</a>.</p>'),
  'resources': panel('High-demand Umbral Sands resources', '<p>Confirmed desert progression materials include Adamant Ore, Yew Wood and Red Dragonhide. They connect to tools, weapons, armour and Fishing equipment, making their source locations and safe farming loops strong long-tail topics. Sunscorch means route efficiency must include shade and hydration rather than only travel distance.</p><p>Use the <a href="/adamant-gear/">Adamant gear list</a>, <a href="/yew-wood/">Yew uses</a> and <a href="/red-dragonhide/">Red Dragonhide overview</a> while exact node maps and recipe quantities are being verified.</p>'),
  'skills-builds': panel('Skill roadmap status', '<p>Dragonwilds has raised skill caps to 99, although some higher-level reward tracks continue to be filled out by updates. Umbral Sands fills Woodcutting and Mining skill trees to 99 with new spells, recipes, perks and rewards. Agility is planned around traversal challenges and movement upgrades; Prayer is planned as a combat and support skill.</p><p>Build pages should state the patch, level range, equipment and intended activity. See <a href="/water-magic/">Water Magic</a> for the latest confirmed magic branch.</p>'),
  'survival-systems': panel('Desert survival changes the loop', '<p>Umbral Sands adds Sunscorch and quicksand. Prolonged sun exposure applies Scorch, which rapidly drains hydration; shelter, shade and travel at dawn or dusk are the confirmed counters. Quicksand makes direct map routes unsafe.</p><p>Late-game survival therefore still depends on route planning, not just armour. Use the <a href="/sunscorch/">Sunscorch checklist</a> and <a href="/quicksand/">quicksand route guide</a> before building resource loops across the desert.</p>'),
  'updates': panel('Major 2026 changes', '<ul><li><strong>0.11:</strong> Dowdun Reach, dedicated servers and skill-cap changes.</li><li><strong>April 2026:</strong> Fishing arrived with anniversary content.</li><li><strong>0.12 / June 23:</strong> Umbral Sands, Water Magic, new gear, bosses, stations and Steam Achievements.</li><li><strong>September 15:</strong> announced Scorned Wilderness, version 1.0 and console release.</li></ul><p>Use the <a href="/umbral-sands/">0.12 content guide</a> for current gameplay changes and the <a href="/release-date/">release tracker</a> for the next milestone.</p>'),
  'weapons-armor': panel('New Umbral Sands equipment', '<p>The 0.12 update adds Adamant tools, eight Adamant weapon types, an armour set, shield and ammunition. It also adds Yew ranged equipment, Infinity Robes, Red Dragonhide armour and four Vestige sets: Lunar Garou, Desert Robes, Kalphite Carapace and Obsidian.</p><p>Equipment now routes through specialized crafting stations. Use the <a href="/adamant-gear/">Adamant list</a>, <a href="/red-dragonhide/">Red Dragonhide guide</a> and <a href="/crafting-stations/">station lookup</a>.</p>')
};

for (const [slug, enhancement] of Object.entries(hubEnhancements)) {
  const target = path.join(root, slug, 'index.html');
  let html = fs.readFileSync(target, 'utf8');
  const wrapped = `<section class="phase1-enhancement">${enhancement}</section>`;
  html = html.split(wrapped).join('');
  html = html.replace('</article>', `${wrapped}</article>`);
  if (!/application\/ld\+json/i.test(html)) {
    const schema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: html.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1] || slug, url: `${site}/${slug}/`, dateModified: updated });
    html = html.replace('</head>', `<script type="application/ld+json">${schema}</script></head>`);
  }
  fs.writeFileSync(target, html);
}

const staleUpdates = [
  ['index.html', [
    ['RuneScape: Dragonwilds Guide | Beginner Tips, Skills, Crafting & Boss Prep', 'RuneScape: Dragonwilds Guide, Wiki & Release Tracker'],
    ['"datePublished": "2026"', '"datePublished": "2026-09-15"'],
    ['RuneScape: Dragonwilds is expected to reach its full release window in 2026; exact full release date is to be announced.', 'RuneScape: Dragonwilds version 1.0 and the console launch are announced for September 15, 2026.'],
    ['data-release-target="2026-12-31T23:59:59Z"', 'data-release-target="2026-09-15T00:00:00Z"'],
    ['2026 target window', 'September 15, 2026'],
    ['Exact full release date is still TBA; countdown tracks the end of the official 2026 window.', 'Officially announced version 1.0 and console launch date.']
  ]],
  ['faq/index.html', [
    ['RuneScape: Dragonwilds FAQ | Release Date, Co-op, Crafting & Beginner Answers', 'RuneScape: Dragonwilds FAQ | Release, Co-op & Crafting'],
    ['RuneScape: Dragonwilds FAQ with concise answers about early access release date, full release estimate, co-op, beginner route, crafting, resources, skills, magic, and guide updates.', 'Dragonwilds FAQ with current answers about release date, consoles, co-op, crafting, resources, skills and major updates.'],
    ['The developer estimate on Steam says the game is expected to be ready to leave Early Access in early 2026, but the exact full release date remains to be announced.', 'Jagex has announced September 15, 2026 for version 1.0 and the console launch.'],
    ['developer estimate says early 2026, exact date TBA.', 'Jagex announced September 15, 2026 for version 1.0 and consoles.']
  ]],
  ['game-info/index.html', [
    ['RuneScape: Dragonwilds Game Info | Release Window, Early Access & Features', 'RuneScape: Dragonwilds Game Info, Release & Features'],
    ['RuneScape: Dragonwilds game info hub covering official early access status, 2026 full release window, PC platform, co-op survival crafting, skills, magic, and roadmap notes.', 'Current Dragonwilds game information covering Early Access, the September 2026 release, platforms, co-op, regions, skills and updates.'],
    ['Steam lists the Early Access Release Date as 15 Apr, 2025 and the developer estimate says the game is expected to leave Early Access in early 2026.', 'Steam lists the Early Access launch as April 15, 2025; Jagex has announced version 1.0 and consoles for September 15, 2026.']
  ]],
  ['dungeons-vaults/index.html', [['RuneScape: Dragonwilds Dungeons & Vaults Guide | Prep, Routes & Rewards', 'Dragonwilds Dungeons & Vaults Guide | Routes & Rewards']]],
  ['early-access-roadmap/index.html', [
    ['RuneScape: Dragonwilds Early Access Roadmap | Updates & Planned Content', 'Dragonwilds 2026 Roadmap | 1.0 & Scorned Wilderness'],
    ['RuneScape: Dragonwilds early access roadmap guide covering current early access content, planned systems, skills, quests, enemies, resources, vaults, and update priorities.', 'Dragonwilds 2026 roadmap covering version 1.0, Scorned Wilderness, consoles, Agility, Prayer and the current update schedule.']
  ]],
  ['guides/index.html', [['RuneScape: Dragonwilds Guides Hub | All Beginner, Crafting & Survival Guides', 'RuneScape: Dragonwilds Guides | All Topics']]],
  ['platforms/index.html', [['RuneScape: Dragonwilds Platforms & Co-op Guide | PC, Multiplayer & Hosting', 'Dragonwilds Platforms | PC, Consoles & Co-op']]],
  ['survival-systems/index.html', [['RuneScape: Dragonwilds Survival Systems Guide | Food, Gear, Base & Exploration', 'Dragonwilds Survival Guide | Food, Base & Hazards']]]
];
for (const [relative, replacements] of staleUpdates) {
  const target = path.join(root, relative); let html = fs.readFileSync(target, 'utf8');
  for (const [before, after] of replacements) html = html.replace(before, after);
  fs.writeFileSync(target, html);
}

const sitemapPaths = [
  '', 'about', 'anima-magic', 'base-building', 'beginner-guide', 'boss-prep', 'co-op', 'crafting-resources',
  'dungeons-vaults', 'early-access-roadmap', 'faq', 'fishing', 'game-info', 'guides', 'map', 'platforms', 'quests',
  'recipes', 'resources', 'skills-builds', 'survival-systems', 'updates', 'weapons-armor', ...pages.map((entry) => entry.slug)
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map((slug) => `  <url><loc>${site}/${slug ? `${slug}/` : ''}</loc><lastmod>${updated}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);

console.log(`Generated ${pages.length} Phase 1 landing pages and ${sitemapPaths.length} sitemap URLs.`);
