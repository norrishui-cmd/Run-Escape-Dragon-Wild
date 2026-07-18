import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://runescapedragonwilds.wiki';
const reviewed = '2026-07-18';

const sources = {
  update12: ['Official 0.12.0 overview', 'https://dragonwilds.runescape.com/news/eye-on-ashenfall-0.12.0'],
  vital12: ['Official 0.12 live fixes and known issues', 'https://dragonwilds.runescape.com/news/0.12-vital-info'],
  road121: ['Official 0.12.1 and release-road update', 'https://dragonwilds.runescape.com/news/0.12.1-and-the-road-to-release'],
  combat: ['Official 0.12.1 combat rework preview', 'https://dragonwilds.runescape.com/news/0-12-1-combat'],
  health: ['Official health and Wardstones rework', 'https://dragonwilds.runescape.com/news/health-and-wardstones'],
  water: ['Official Water Magic preview', 'https://dragonwilds.runescape.com/news/introducing-water-magic']
};

const nav = `<header class="site-header"><a class="brand" href="/"><span class="brand-mark">DW</span><span>Dragonwilds Field Guide</span></a><nav aria-label="Primary navigation"><a href="/guides/">Guides</a><a href="/quests/">Quests</a><a href="/resources/">Resources</a><a href="/skills-builds/">Skills</a><a href="/map/">Map</a><a href="/updates/">Updates</a></nav></header>`;
const footer = `<footer class="site-footer"><p><strong>Dragonwilds Field Guide</strong> is an unofficial fan resource and is not affiliated with Jagex.</p><p><a href="/about/">Editorial policy</a> · <a href="/sitemap.xml">Sitemap</a> · Content reviewed ${reviewed}</p></footer>`;
const panel = (heading, html) => `<section class="content-panel"><h2>${heading}</h2>${html}</section>`;

function sourceBox(keys) {
  return `<aside class="source-box" aria-label="Sources"><h2>Sources and status</h2><p>Official details on this page were checked on ${reviewed}. Announced features are labelled separately from live 0.12 systems.</p><ul>${keys.map((key) => `<li><a href="${sources[key][1]}" rel="noopener noreferrer">${sources[key][0]}</a></li>`).join('')}</ul></aside>`;
}

function render(entry) {
  const url = `${site}/${entry.slug}/`;
  const parts = entry.slug.split('/');
  const breadcrumb = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` }, ...parts.map((part, i) => ({ '@type': 'ListItem', position: i + 2, name: part.replaceAll('-', ' '), item: `${site}/${parts.slice(0, i + 1).join('/')}/` }))];
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: entry.h1, description: entry.description, dateModified: reviewed, mainEntityOfPage: url, author: { '@type': 'Organization', name: 'Dragonwilds Field Guide' } },
    { '@type': 'BreadcrumbList', itemListElement: breadcrumb }
  ] };
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${entry.title}</title><meta name="description" content="${entry.description}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><meta property="og:type" content="article"><meta property="og:title" content="${entry.h1}"><meta property="og:description" content="${entry.description}"><meta property="og:url" content="${url}"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body>${nav}<main class="page-main"><article><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/${parts[0]}/">${parts[0].replaceAll('-', ' ')}</a><span>›</span><span>${entry.h1}</span></nav><p class="eyebrow">${entry.eyebrow}</p><h1>${entry.h1}</h1><section class="quick-answer"><h2>Quick answer</h2>${entry.answer}</section>${entry.sections.join('')}${sourceBox(entry.sources)}${panel('Related guides', `<ul>${entry.related.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>`)}</article></main>${footer}</body></html>`;
}

const pages = [
  {
    slug: 'updates/0-12-1', title: 'Dragonwilds 0.12.1 Update: Release Window & Confirmed Changes',
    description: 'Dragonwilds update 0.12.1 is planned for late July 2026 with Agility, combat improvements, weapon upgrades and release-road preparation.',
    eyebrow: 'Update tracker', h1: 'Dragonwilds 0.12.1 Update',
    answer: '<p><strong>Update 0.12.1 is announced for late July 2026 and is the final planned stop before Scorned Wilderness and version 1.0.</strong> Jagex has confirmed Agility, combat quality-of-life changes, Upgrade Cores and movement improvements, but the complete patch contents are not yet final.</p>',
    sections: [panel('Confirmed for 0.12.1', '<ul><li>Agility skill introduction.</li><li>Upgrade Masterworks and weapons at the Mystic Forge using Upgrade Cores.</li><li>Item/spell hotwheel and a quick-cast shortcut.</li><li>Lower jump stamina cost and later fall-damage onset.</li><li>Rune and arrow cycling without opening inventory.</li><li>Automatic off-hand re-equipping after swapping back from a two-handed weapon.</li></ul>'), panel('What belongs to 1.0 instead', '<p>Wands, the Special Attack bar, the full parry/Visceral Attack system and several combat responsiveness changes were announced for the September 15 version 1.0 milestone rather than guaranteed for 0.12.1. Keeping those timelines separate prevents players from searching for features that are not live yet.</p><p>This page should be refreshed when Jagex publishes the promised full Agility breakdown and final 0.12.1 patch notes.</p>')],
    sources: ['road121', 'combat'], related: [['Combat rework', '/combat/0-12-1-rework/'], ['Agility status', '/skills/agility/'], ['Release date', '/release-date/']]
  },
  {
    slug: 'combat/0-12-1-rework', title: 'Dragonwilds Combat Rework: 0.12.1 vs 1.0 Changes',
    description: 'A clear breakdown of Dragonwilds combat changes planned for 0.12.1 and version 1.0, including swaps, blocking, parrying, wands and specials.',
    eyebrow: 'Combat system', h1: 'Dragonwilds Combat Rework Explained',
    answer: '<p><strong>The combat overhaul is split across 0.12.1 and version 1.0.</strong> The July update focuses on swapping, hotwheels, jump/fall changes and weapon upgrades; the September release adds deeper blocking, parrying, animation cancelling, Special Attacks and Wands.</p>',
    sections: [panel('0.12.1 improvements', '<p>Players will be able to cycle runes and arrows during combat, use a radial hotwheel, assign quick cast to a spell or item, and recover an off-hand item automatically after switching away from a two-handed weapon. Jumping is planned to cost 10 stamina instead of 20, with Agility reducing it further.</p>'), panel('Version 1.0 combat changes', '<p>Jagex plans earlier and shorter block windows, visible mitigated damage, walking during selected skill-spell casts, attack-while-sprinting openers, animation cancels, stronger parry rewards, a recharging Special Attack bar and mobile Wands. These are announced features, not live 0.12 behavior.</p>'), panel('Why version labels matter', '<p>Combat advice can become wrong quickly when stamina costs, cancel windows or spell movement change. Strategy pages should state the tested game version and avoid mixing current controls with announced September mechanics.</p>')],
    sources: ['combat'], related: [['Special Attacks', '/combat/special-attacks/'], ['Wands', '/combat/wands/'], ['0.12.1 tracker', '/updates/0-12-1/']]
  },
  {
    slug: 'combat/special-attacks', title: 'Dragonwilds Special Attack Bar: How It Will Work at 1.0',
    description: 'Dragonwilds version 1.0 adds a rechargeable Special Attack bar, limiting powerful weapon specs while reducing their stamina burden.',
    eyebrow: 'Announced for 1.0', h1: 'Special Attack Bar Guide',
    answer: '<p><strong>The Special Attack bar is planned for version 1.0 on September 15, 2026.</strong> Weapon specials will consume part of a bar that recharges over time, allowing attacks such as Titan’s Wrath and the Greatsword special to hit harder without being spammed.</p>',
    sections: [panel('How the system changes combat', '<p>Current weapon specials behave more like another move in the rotation. The announced bar turns them into limited tactical choices: spend charge during a safe damage window, then wait for recovery. Jagex also intends to reduce the stamina cost of specials because frequency will be controlled by the new resource.</p>'), panel('What players should not assume yet', '<p>The announcement does not provide charge percentages for each weapon, the exact recharge rate or a complete weapon list. Build calculators should wait for the live 1.0 values. Until then, this page tracks the confirmed design rather than publishing guessed rotations.</p>')],
    sources: ['combat'], related: [['Combat rework', '/combat/0-12-1-rework/'], ['Wands', '/combat/wands/'], ['Boss preparation', '/boss-prep/']]
  },
  {
    slug: 'combat/wands', title: 'Dragonwilds Wands: New 1.0 Magic Weapon Explained',
    description: 'Wands are a fast, mobile magic weapon type announced for Dragonwilds 1.0, trading lower damage for movement and elemental buildup.',
    eyebrow: 'Announced magic weapon', h1: 'Dragonwilds Wands Explained',
    answer: '<p><strong>Wands are planned for version 1.0 as a faster, more mobile alternative to Staves.</strong> They deal comparatively lower damage but still build Air knockdown, Fire burn and Water slow effects.</p>',
    sections: [panel('Wands versus Staves', '<p>Jagex describes Wands as the movement-focused option: use them when repositioning and maintaining elemental buildup matter more than maximum individual hits. Staves remain the heavier-damage choice for players who can create space and commit to slower attacks.</p>'), panel('What remains unknown', '<p>Specific Wand names, recipes, stats, upgrade tiers and spell interactions have not been published. Individual item URLs should remain outside the sitemap until the 1.0 database can answer those questions. The confirmed search intent today is the weapon type and its role.</p>')],
    sources: ['combat', 'water'], related: [['Water Magic', '/water-magic/'], ['Combat rework', '/combat/0-12-1-rework/'], ['Anima Magic', '/anima-magic/']]
  },
  {
    slug: 'combat/parrying', title: 'Dragonwilds Parrying & Visceral Attacks in Version 1.0',
    description: 'Successful parries are planned to restore 50% maximum stamina and enable one cinematic Visceral Attack in Dragonwilds version 1.0.',
    eyebrow: 'Announced combat mechanic', h1: 'Parrying and Visceral Attacks',
    answer: '<p><strong>At version 1.0, a successful parry is planned to restore 50% of maximum stamina and open one Visceral Attack.</strong> Blocking will also start earlier, animate faster and show mitigated damage more clearly.</p>',
    sections: [panel('Parry reward', '<p>The design makes a correct defensive read an offensive opportunity. Restored stamina helps fund the follow-up, while the one-use Visceral Attack creates a clear punish window rather than leaving the player unsure whether a parry succeeded.</p>'), panel('Current-build warning', '<p>These values come from the 1.0 combat preview and should not be used as a promise about the live 0.12 timing window. Enemy strategy pages need retesting after September because a boss that feels stamina-starved now may play differently once parry recovery and block responsiveness change.</p>')],
    sources: ['combat'], related: [['Combat rework', '/combat/0-12-1-rework/'], ['Special Attacks', '/combat/special-attacks/'], ['Fuzan boss guide', '/fuzan/']]
  },
  {
    slug: 'systems/health-rework', title: 'Dragonwilds Health Rework: Wardshield, Food & Max HP',
    description: 'Update 0.12 removed Wardshield and Wardstones, moved damage to one HP pool, added Constitution Shrines and made food heal instantly.',
    eyebrow: 'Live 0.12 system', h1: 'Health and Wardshield Rework',
    answer: '<p><strong>Update 0.12 removed Wardshield and Wardstones.</strong> Damage now goes directly to health, maximum HP grows through Constitution Shrines, food restores HP instantly, and old healing potions return their components when used.</p>',
    sections: [panel('What changed', '<ul><li>Wardshield no longer provides a separate armour-scaled health layer.</li><li>Players can raise maximum HP above 100 through exploration.</li><li>Cooked food is the main fast-healing resource; fish provide the strongest raw HP healing.</li><li>Other foods can trade some healing value for buffs.</li><li>Stat potions remain, while healing potions were removed from the active loop.</li></ul>'), panel('How preparation changes', '<p>Boss readiness now depends on permanent shrine progress and a food loadout, not filling a Wardshield bar. Players returning from an older build should revisit food storage and exploration before judging whether their armour is underpowered.</p>')],
    sources: ['health'], related: [['Constitution Shrines', '/systems/constitution-shrines/'], ['Food healing', '/systems/food-healing/'], ['Survival systems', '/survival-systems/']]
  },
  {
    slug: 'systems/constitution-shrines', title: 'Dragonwilds Constitution Shrines: How Max HP Progression Works',
    description: 'Constitution Shrines across Ashenfall permanently increase maximum HP above 100 after the Dragonwilds 0.12 health rework.',
    eyebrow: 'Exploration progression', h1: 'Constitution Shrines and Max HP',
    answer: '<p><strong>Constitution Shrines are exploration milestones placed across Ashenfall that increase maximum HP beyond the starting 100.</strong> They replace Wardshield-based survivability as the permanent health-growth path.</p>',
    sections: [panel('Why shrines matter', '<p>Health growth is now separate from armour. Finding shrines makes every later food heal and defensive choice operate on a larger base pool, so a player stuck on a boss may need more exploration rather than only the next armour material.</p>'), panel('Location-page quality rule', '<p>This hub does not invent shrine coordinates. Each future shrine-location page must show a verified region, nearby landmark, route, access requirement and current patch. Until that evidence is collected, the sitemap should contain the system answer but not placeholder marker pages.</p>')],
    sources: ['health'], related: [['Health rework', '/systems/health-rework/'], ['Map guide', '/map/'], ['Boss preparation', '/boss-prep/']]
  },
  {
    slug: 'systems/food-healing', title: 'Dragonwilds Food Healing After 0.12: Fish, Buffs & Potions',
    description: 'Food now heals instantly in Dragonwilds: fish lead for raw HP, other foods provide buffs, and healing potions were removed in update 0.12.',
    eyebrow: 'Live survival mechanic', h1: 'Food Healing After Update 0.12',
    answer: '<p><strong>Food instantly restores HP in the current build, with fish positioned as the strongest choice for raw healing.</strong> Other food types can provide additional buffs, while drinking and eating no longer use the old consumption animation.</p>',
    sections: [panel('What to carry', '<p>For a difficult fight, separate the inventory into reliable high-HP food and situational buff food. The best ratio depends on the encounter, but the system now rewards prepared cooking and Fishing more directly than stockpiling healing potions.</p>'), panel('Existing healing potions', '<p>Healing potions were removed from future use, but old potions are not simply deleted. Using one disassembles it and returns its components. Stat potions remain part of the game, so “potions removed” refers specifically to direct-healing potions.</p>')],
    sources: ['health', 'vital12'], related: [['Health rework', '/systems/health-rework/'], ['Fishing guide', '/fishing/'], ['Boss preparation', '/boss-prep/']]
  },
  {
    slug: 'skills/mining-50-99', title: 'Dragonwilds Mining Levels 50–99: Unlocks & Perks',
    description: 'Dragonwilds Mining 50–99 unlocks Divine Rock at 51, Ore & Stone Storage at 59, Ultimate Burst, Accelerated Veins and lighter ingots.',
    eyebrow: 'Skill progression', h1: 'Mining Level 50–99 Unlocks',
    answer: '<p><strong>Update 0.12 fills the upper Mining track with a spell, storage recipe and three major perks.</strong> Key levels are 51, 59, 69, 71 and 74.</p>',
    sections: [panel('Unlock table', '<div class="table-wrap"><table><thead><tr><th>Level</th><th>Unlock</th><th>Effect</th></tr></thead><tbody><tr><td>51</td><td>Divine Rock</td><td>Turns five ore on the ground into a personal mining vein.</td></tr><tr><td>59</td><td>Ore & Stone Storage</td><td>Unlocks dedicated mineral storage.</td></tr><tr><td>69</td><td>Ultimate Burst</td><td>Increases Rocksplosion area of effect.</td></tr><tr><td>71</td><td>Accelerated Veins</td><td>Gives Divine Rock a chance to drop gemstones.</td></tr><tr><td>74</td><td>Ingot Weight Reduction</td><td>Reduces ingot weight by 50%.</td></tr></tbody></table></div>'), panel('Progression use', '<p>The track moves from creating a reusable vein to improving area gathering, rare drops and transport weight. It is most useful when planned with Adamant trips and dedicated base storage rather than treated as isolated level rewards.</p>')],
    sources: ['update12'], related: [['Divine Rock', '/skills/divine-rock/'], ['Ore storage', '/buildings/ore-stone-storage/'], ['Adamant gear', '/adamant-gear/']]
  },
  {
    slug: 'skills/divine-rock', title: 'Dragonwilds Divine Rock: Mining Level 51 Spell Guide',
    description: 'Divine Rock is a level 51 Mining spell that turns five ore on the ground into a personal mining vein, later gaining gemstone potential.',
    eyebrow: 'Mining spell', h1: 'Divine Rock Spell',
    answer: '<p><strong>Divine Rock unlocks at Mining level 51 and converts five ore items on the ground into a personal mining vein.</strong> At level 71, Accelerated Veins adds a chance for the spell-created vein to drop gemstones.</p>',
    sections: [panel('Best use case', '<p>The spell consolidates loose ore into continued mining at one point. It is designed for gathering efficiency rather than directly creating free ore: the starting five ore are the input. Use it where a personal vein reduces movement and keeps the group’s route organized.</p>'), panel('Related unlocks', '<p>Level 69 expands Rocksplosion through Ultimate Burst, level 71 improves Divine Rock with gemstone potential, and level 74 halves ingot weight. Together they reduce travel friction across late-game ore loops.</p>')],
    sources: ['update12'], related: [['Mining 50–99', '/skills/mining-50-99/'], ['Ore storage', '/buildings/ore-stone-storage/'], ['Resources hub', '/resources/']]
  },
  {
    slug: 'skills/woodcutting-50-99', title: 'Dragonwilds Woodcutting Levels 50–99: Unlocks & Perks',
    description: 'Dragonwilds Woodcutting 50–99 includes Trunk Totem, Lumber Storage, wood weight reduction, Lumber Backpack and Axtral Projection upgrade.',
    eyebrow: 'Skill progression', h1: 'Woodcutting Level 50–99 Unlocks',
    answer: '<p><strong>Update 0.12 expands the upper Woodcutting track with five confirmed milestones from level 52 through level 88.</strong> The rewards improve consolidation, storage, carrying weight, rare drops and area cutting.</p>',
    sections: [panel('Unlock table', '<div class="table-wrap"><table><thead><tr><th>Level</th><th>Unlock</th><th>Effect</th></tr></thead><tbody><tr><td>52</td><td>Trunk Totem</td><td>Transmutes scattered trees into a single totem.</td></tr><tr><td>59</td><td>Lumber Storage</td><td>High-capacity log and plank storage.</td></tr><tr><td>67</td><td>Wood Weight Reduction</td><td>Reduces wood carry weight by 50%.</td></tr><tr><td>78</td><td>Lumber Backpack</td><td>Improves XP, rare-drop chance and wood weight.</td></tr><tr><td>88</td><td>Axtral Projection Upgrade</td><td>Upgrades the spell to three spectral axes.</td></tr></tbody></table></div>'), panel('Progression use', '<p>The early milestones make a tree cluster easier to process; later rewards increase trip duration and output. This creates a clear Yew-focused progression loop in Umbral Sands without requiring separate placeholder pages for every unknown tree node.</p>')],
    sources: ['update12'], related: [['Trunk Totem', '/skills/trunk-totem/'], ['Lumber Backpack', '/equipment/lumber-backpack/'], ['Yew Wood', '/yew-wood/']]
  },
  {
    slug: 'skills/trunk-totem', title: 'Dragonwilds Trunk Totem: Woodcutting Level 52 Spell',
    description: 'Trunk Totem unlocks at Woodcutting level 52 and transmutes scattered trees into one harvestable totem for more efficient gathering.',
    eyebrow: 'Woodcutting spell', h1: 'Trunk Totem Spell Guide',
    answer: '<p><strong>Trunk Totem unlocks at Woodcutting level 52 and consolidates scattered trees into one totem.</strong> It reduces movement between individual trunks and sets up a more concentrated gathering point.</p>',
    sections: [panel('How it fits the skill track', '<p>The spell is followed by Lumber Storage at 59, 50% wood-weight reduction at 67, the Lumber Backpack at 78 and a three-axe Axtral Projection upgrade at 88. The intended loop is consolidation first, then longer and more productive carrying runs.</p>'), panel('Current issue note', '<p>The official 0.12 issue page previously listed a problem where creating and harvesting three Trunk Totems could leave the third unharvestable with lingering audio. Because live hotfix status can change, verify the current build before treating that behavior as permanent.</p>')],
    sources: ['update12', 'vital12'], related: [['Woodcutting 50–99', '/skills/woodcutting-50-99/'], ['Lumber storage', '/buildings/lumber-storage/'], ['Yew Wood', '/yew-wood/']]
  },
  {
    slug: 'skills/agility', title: 'Dragonwilds Agility: 0.12.1 Release Status & Confirmed Effects',
    description: 'Agility is planned for Dragonwilds update 0.12.1 with lower jump costs, fall-damage perks and a breakfall mechanic.',
    eyebrow: 'Announced skill', h1: 'Agility Skill Status',
    answer: '<p><strong>Agility is announced for update 0.12.1 at the end of July 2026.</strong> Confirmed movement effects include reducing jump stamina below the new 10-point base cost, more forgiving fall damage and a breakfall mechanic.</p>',
    sections: [panel('Confirmed purpose', '<p>Agility is built around movement and traversal rather than only occasional shortcuts. The combat preview connects it directly to jumping, fall-damage leniency and recovering from higher drops. Scorned Wilderness uses floating islands and vertical terrain, making movement progression especially relevant.</p>'), panel('What is still pending', '<p>Jagex has promised a complete Agility breakdown. Exact course locations, XP rates, level unlocks and spell names should not be published as indexed database pages until that breakdown or the live patch confirms them.</p>')],
    sources: ['road121', 'combat'], related: [['0.12.1 update', '/updates/0-12-1/'], ['Combat rework', '/combat/0-12-1-rework/'], ['Scorned Wilderness', '/scorned-wilderness/']]
  },
  {
    slug: 'buildings/ore-stone-storage', title: 'Dragonwilds Ore & Stone Storage: Mining Level 59 Unlock',
    description: 'Ore & Stone Storage unlocks at Mining level 59 and provides a dedicated place to store minerals after the Dragonwilds 0.12 update.',
    eyebrow: 'Base storage', h1: 'Ore & Stone Storage',
    answer: '<p><strong>Ore & Stone Storage is a buildable piece unlocked at Mining level 59.</strong> It is dedicated to ore and stone, reducing the need to mix heavy gathering materials with general crafting storage.</p>',
    sections: [panel('When to build it', '<p>Build the storage when late-game Mining runs begin filling ordinary chests or when Adamant trips repeatedly interrupt crafting flow. Place it near the Blacksmith’s Bench and ingot-processing route so deposits do not require crossing the entire base.</p>'), panel('Related Mining benefits', '<p>At level 74, the Mining track reduces ingot weight by 50%, while Divine Rock and Accelerated Veins improve field gathering. Storage solves the base-side bottleneck; the perks solve the travel-side bottleneck.</p>')],
    sources: ['update12'], related: [['Mining 50–99', '/skills/mining-50-99/'], ['Crafting stations', '/crafting-stations/'], ['Base building', '/base-building/']]
  },
  {
    slug: 'buildings/lumber-storage', title: 'Dragonwilds Lumber Storage: Woodcutting Level 59 Unlock',
    description: 'Lumber Storage unlocks at Woodcutting level 59 and provides high-capacity storage for logs and planks in Dragonwilds bases.',
    eyebrow: 'Base storage', h1: 'Lumber Storage',
    answer: '<p><strong>Lumber Storage is a level 59 Woodcutting recipe for a high-capacity log and plank container.</strong> It supports long gathering runs and separates building materials from general inventory.</p>',
    sections: [panel('Best base placement', '<p>Place it between the base entrance and stations that consume wood. The goal is a short deposit route from gathering, plus quick access for building and ranged crafting. It is especially valuable after level 67 reduces wood weight and trips become longer.</p>'), panel('Progression connection', '<p>Trunk Totem consolidates trees at 52; Lumber Storage handles output at 59; weight reduction arrives at 67; the Lumber Backpack improves XP and rare drops at 78. The storage is the first permanent base upgrade in that chain.</p>')],
    sources: ['update12'], related: [['Woodcutting 50–99', '/skills/woodcutting-50-99/'], ['Lumber Backpack', '/equipment/lumber-backpack/'], ['Base building', '/base-building/']]
  },
  {
    slug: 'buildings/advanced-tannery', title: 'Dragonwilds Advanced Tannery: What It Is Used For',
    description: 'The Advanced Tannery was added with Umbral Sands to process higher-quality leathers, including progression toward stronger armour tiers.',
    eyebrow: 'Processing station', h1: 'Advanced Tannery Guide',
    answer: '<p><strong>The Advanced Tannery is the 0.12 processing station for better leathers.</strong> It belongs in the Red Dragonhide and higher-tier armour workflow, while final armour crafting takes place at the Armour Bench.</p>',
    sections: [panel('Station role', '<p>The tannery processes the raw material; it does not replace the Armour Bench. Players searching for a finished armour set should first confirm whether the hide needs tanning, then move the processed leather to the specialized armour station.</p>'), panel('Why this is a separate page', '<p>The 0.12 crafting rework split processing from final equipment categories. A single “crafting station” answer can no longer explain every missing recipe. This page targets the material-processing step without inventing recipe quantities that require live verification.</p>')],
    sources: ['update12'], related: [['Red Dragonhide', '/red-dragonhide/'], ['Crafting stations', '/crafting-stations/'], ['Armour sets', '/equipment/vestige-armour-sets/']]
  },
  {
    slug: 'buildings/fermentation-barrel', title: 'Dragonwilds Fermentation Barrel: Upgrade Tier 3 Potions',
    description: 'The Fermentation Barrel upgrades eligible Tier 3 potions into stronger Tier 4 potions in Dragonwilds update 0.12 while stat potions remain active.',
    eyebrow: 'Potion station', h1: 'Fermentation Barrel Guide',
    answer: '<p><strong>The Fermentation Barrel upgrades Tier 3 potions into more powerful Tier 4 versions.</strong> It remains relevant after direct-healing potions were removed because stat potions continue to exist.</p>',
    sections: [panel('What the barrel does', '<p>The station is an upgrade step, not a replacement for every potion recipe. Bring an eligible Tier 3 potion to the barrel to progress it to Tier 4. Exact eligible names and ingredient costs should be verified individually before recipe pages enter the sitemap.</p>'), panel('Health-rework context', '<p>Update 0.12 moved direct healing toward food and fish, but it did not remove stat potions. The barrel therefore supports preparation buffs rather than rebuilding the old healing-potion loop.</p>')],
    sources: ['update12', 'health'], related: [['Food healing', '/systems/food-healing/'], ['Crafting stations', '/crafting-stations/'], ['Survival systems', '/survival-systems/']]
  },
  {
    slug: 'equipment/lumber-backpack', title: 'Dragonwilds Lumber Backpack: Level 78 Unlock & Effects',
    description: 'The Lumber Backpack unlocks at Woodcutting level 78 and improves XP, rare-drop chance and wood carrying efficiency.',
    eyebrow: 'Woodcutting equipment', h1: 'Lumber Backpack',
    answer: '<p><strong>The Lumber Backpack is a Woodcutting level 78 recipe.</strong> When worn, it increases Woodcutting XP, improves rare-drop chances and reduces wood weight.</p>',
    sections: [panel('Why it changes farming routes', '<p>The backpack improves three constraints at once: experience per action, chance of valuable drops and how long the player can stay away from storage. It is therefore more useful on dedicated gathering runs than in a general combat loadout.</p>'), panel('Build synergy', '<p>Combine it with the level 67 wood-weight perk and level 59 Lumber Storage. The perk and backpack extend the trip; storage keeps the larger haul organized after returning to base.</p>')],
    sources: ['update12'], related: [['Woodcutting 50–99', '/skills/woodcutting-50-99/'], ['Lumber storage', '/buildings/lumber-storage/'], ['Yew Wood', '/yew-wood/']]
  },
  {
    slug: 'equipment/vestige-armour-sets', title: 'Dragonwilds Umbral Sands Vestige Armour Sets Compared',
    description: 'Umbral Sands adds Lunar Garou and Desert Robes for Magic, Kalphite Carapace for Ranged and Obsidian for Melee.',
    eyebrow: 'Equipment comparison', h1: 'Umbral Sands Vestige Armour Sets',
    answer: '<p><strong>Update 0.12 adds four Vestige armour sets:</strong> Lunar Garou and Desert Robes for Magic, Kalphite Carapace for Ranged, and Obsidian for Melee.</p>',
    sections: [panel('Combat-style map', '<div class="table-wrap"><table><thead><tr><th>Set</th><th>Style</th><th>Crafting category</th></tr></thead><tbody><tr><td>Lunar Garou</td><td>Magic</td><td>Mystic Forge / Vestige progression</td></tr><tr><td>Desert Robes</td><td>Magic</td><td>Mystic Forge / Vestige progression</td></tr><tr><td>Kalphite Carapace</td><td>Ranged</td><td>Mystic Forge / Vestige progression</td></tr><tr><td>Obsidian</td><td>Melee</td><td>Mystic Forge / Vestige progression</td></tr></tbody></table></div>'), panel('What this comparison does not claim', '<p>The official overview confirms style assignments but not the complete live stats, recipes or best-in-slot ranking. Those values should be tested before individual set pages make recommendations. For now, this page answers which new set belongs to each combat style and where Vestiges fit in the reworked stations.</p>')],
    sources: ['update12'], related: [['Crafting stations', '/crafting-stations/'], ['Infinity Robes', '/equipment/infinity-robes/'], ['Weapons and armour', '/weapons-armor/']]
  },
  {
    slug: 'equipment/infinity-robes', title: 'Dragonwilds Infinity Robes: Umbral Sands Magic Armour',
    description: 'Infinity Cloth can be spun and crafted into Infinity Robes, a new magic equipment tier added with Dragonwilds Umbral Sands.',
    eyebrow: 'Magic equipment', h1: 'Infinity Robes Overview',
    answer: '<p><strong>Infinity Robes are a new magic armour option made from spun Infinity Cloth in the Umbral Sands update.</strong> They are separate from the Lunar Garou and Desert Robes Vestige sets.</p>',
    sections: [panel('Material and station path', '<p>The confirmed chain begins with Infinity Cloth and ends with the robe set. The 0.12 station rework places armour sets at the Armour Bench, while magic weapons and Vestiges use the Mystic Forge. Do not search the Vestige station for ordinary robe crafting without checking the item category.</p>'), panel('Comparison boundary', '<p>Infinity Robes and magic Vestige sets serve the same broad combat style but are different progression categories. A best-set claim requires verified stats, set effects and upgrade costs; this overview intentionally avoids guessing those values.</p>')],
    sources: ['update12'], related: [['Vestige armour sets', '/equipment/vestige-armour-sets/'], ['Crafting stations', '/crafting-stations/'], ['Water Magic', '/water-magic/']]
  },
  {
    slug: 'equipment/yew-weapons', title: 'Dragonwilds Yew Weapons: Shortbow, Longbow & Crossbow Stock',
    description: 'Yew Wood from Umbral Sands is used for the Yew Shortbow, Yew Longbow, Yew Crossbow Stock and Yew Fishing Rod at current crafting stations.',
    eyebrow: 'Ranged progression', h1: 'Yew Weapons and Equipment',
    answer: '<p><strong>Yew Wood supports three confirmed ranged crafts—Yew Shortbow, Yew Longbow and Yew Stock for a Crossbow—plus the Yew Fishing Rod.</strong> Ranged weapon crafting belongs at the Fletching Bench after 0.12.</p>',
    sections: [panel('Confirmed Yew outputs', '<ul><li>Yew Shortbow</li><li>Yew Longbow</li><li>Yew Stock for Crossbow</li><li>Yew Fishing Rod</li></ul><p>The stock is a crossbow component rather than a complete weapon. This distinction matters when a player sees the component recipe but cannot equip the result.</p>'), panel('Farming and crafting flow', '<p>Yew grows across Umbral Sands, where Sunscorch makes shade and hydration part of the gathering route. Deposit logs in Lumber Storage, then use the Fletching Bench for ranged equipment. Exact quantities should be recorded from the live recipe UI before separate recipe URLs are indexed.</p>')],
    sources: ['update12'], related: [['Yew Wood', '/yew-wood/'], ['Lumber Backpack', '/equipment/lumber-backpack/'], ['Crafting stations', '/crafting-stations/']]
  },
  {
    slug: 'mounts/magic-carpet', title: 'Dragonwilds Magic Carpet Mount: Unlock Requirements',
    description: 'The Magic Carpet mount is earned through Moon Garou quests, but mount access still requires completing The Wild Hunt in Fellhollow.',
    eyebrow: 'Mount unlock', h1: 'Magic Carpet Mount',
    answer: '<p><strong>The Magic Carpet is earned through Moon Garou quests in Umbral Sands.</strong> Players must also complete The Wild Hunt in Fellhollow to access mounts, even if a carpet customization has already been unlocked.</p>',
    sections: [panel('Two-part requirement', '<ol><li>Progress Moon Garou quests to earn the Magic Carpet or its customization rewards.</li><li>Complete The Wild Hunt in Fellhollow to unlock the underlying mount system.</li></ol><p>Having a customization before The Wild Hunt does not bypass the mount prerequisite.</p>'), panel('Known interface confusion', '<p>The official 0.12 issue page noted greyed-out carpet variants and a defunct mount prompt when a skin was earned before the Terrorbird mount quest. Those reports may be patched; the durable fix is to complete The Wild Hunt before diagnosing the cosmetic as permanently unavailable.</p>')],
    sources: ['update12', 'vital12'], related: [['Umbral Sands', '/umbral-sands/'], ['Quests hub', '/quests/'], ['Map guide', '/map/']]
  },
  {
    slug: 'enemies/umbral-sands', title: 'Dragonwilds Umbral Sands Enemies & Bosses List',
    description: 'Umbral Sands enemies include Fuzan, Tok-Xil, Red Dragon, Kalphite Queen, three Kalphites, three KotHaar and desert wildlife.',
    eyebrow: 'Enemy database hub', h1: 'Umbral Sands Enemy List',
    answer: '<p><strong>Umbral Sands adds four named bosses or mini-bosses, six faction enemies and three wildlife types.</strong> The roster includes Fuzan, Tok-Xil, Red Dragon, Kalphite Queen, Kalphites, KotHaar, Desert Kebbit, Goat and Vulture.</p>',
    sections: [panel('Bosses and mini-bosses', '<ul><li><a href="/fuzan/">Fuzan</a></li><li><a href="/enemies/tok-xil/">Tok-Xil</a></li><li><a href="/enemies/red-dragon/">Red Dragon</a></li><li><a href="/enemies/kalphite-queen/">Kalphite Queen</a></li></ul>'), panel('Regular enemies', '<p><strong>Kalphites:</strong> Worker, Soldier and Guardian. <strong>KotHaar:</strong> KotHaar-Xil, KotHaar-Kal and KotHaar-Ket. <strong>Wildlife:</strong> Desert Kebbit, Goat and Vulture.</p><p>Individual pages for regular enemies remain outside the sitemap until their locations, resistances, drops and strategy can be verified. A name alone is not enough to answer a player query.</p>')],
    sources: ['update12'], related: [['Fuzan', '/fuzan/'], ['Fight Cave', '/fight-cave/'], ['Umbral Sands', '/umbral-sands/']]
  },
  {
    slug: 'enemies/tok-xil', title: 'Dragonwilds Tok-Xil: Umbral Sands Mini-Boss Status',
    description: 'Tok-Xil is an Umbral Sands boss or mini-boss added in update 0.12; an early missing-drop issue was fixed in patch 0.12.0.4.',
    eyebrow: 'Enemy status', h1: 'Tok-Xil',
    answer: '<p><strong>Tok-Xil is one of the named bosses or mini-bosses introduced with Umbral Sands.</strong> Patch 0.12.0.4 fixed an issue that prevented Tok-Xil enemies from dropping items on death.</p>',
    sections: [panel('Current patch context', '<p>If an older guide says Tok-Xil has no drops, it may describe the launch bug rather than intended behavior. Update the game and any dedicated server to a current build before testing drop results.</p>'), panel('Strategy evidence still needed', '<p>The official sources used here confirm the enemy and the drop fix, but not a full weakness table, exact spawn route or loot percentages. Those fields should be added only after live verification; this page does not fabricate them to look complete.</p>')],
    sources: ['update12', 'vital12'], related: [['Umbral Sands enemies', '/enemies/umbral-sands/'], ['Fight Cave', '/fight-cave/'], ['Updates', '/updates/']]
  },
  {
    slug: 'enemies/kalphite-queen', title: 'Dragonwilds Kalphite Queen: Umbral Sands Boss Overview',
    description: 'The Kalphite Queen is a named Umbral Sands boss added in update 0.12; early patches fixed dramatic sand-level changes during the encounter.',
    eyebrow: 'Boss status', h1: 'Kalphite Queen Overview',
    answer: '<p><strong>The Kalphite Queen is one of the four named bosses or mini-bosses added with Umbral Sands.</strong> The 0.12 hotfix log records a fix for sand levels changing drastically during the encounter.</p>',
    sections: [panel('Encounter context', '<p>The boss belongs to the Kalphite branch of the desert roster, alongside Workers, Soldiers and Guardians. Kalphite Carapace is also the ranged Vestige armour set introduced in the same update, but the official overview does not state a complete drop chain.</p>'), panel('What to verify before a strategy page', '<p>A trustworthy boss strategy needs the entrance route, arena conditions, attacks, weaknesses, phases and drop table from the current patch. Until those are tested, this page provides confirmed status and patch history rather than guessed counters.</p>')],
    sources: ['update12', 'vital12'], related: [['Umbral Sands enemies', '/enemies/umbral-sands/'], ['Vestige armour sets', '/equipment/vestige-armour-sets/'], ['Boss preparation', '/boss-prep/']]
  },
  {
    slug: 'enemies/red-dragon', title: 'Dragonwilds Red Dragon: Umbral Sands Boss & Gear Context',
    description: 'Red Dragon is a named Umbral Sands boss or mini-boss added in update 0.12 alongside Red Dragonhide armour progression.',
    eyebrow: 'Boss status', h1: 'Red Dragon Overview',
    answer: '<p><strong>Red Dragon is one of the named Umbral Sands bosses or mini-bosses introduced in update 0.12.</strong> Red Dragonhide can be tanned and crafted into the region’s ranged armour tier.</p>',
    sections: [panel('Progression relationship', '<p>The enemy and material share the same update branch, but a complete drop rate or guaranteed-hide claim requires live evidence. The Advanced Tannery handles stronger leather processing, and finished armour belongs at the Armour Bench.</p>'), panel('Preparation boundary', '<p>Use the general boss checklist—current health progression, repaired gear, food and a safe desert route—until attack-specific testing is available. The page intentionally does not copy assumptions from other RuneScape games.</p>')],
    sources: ['update12'], related: [['Red Dragonhide', '/red-dragonhide/'], ['Advanced Tannery', '/buildings/advanced-tannery/'], ['Umbral Sands enemies', '/enemies/umbral-sands/']]
  },
  {
    slug: 'scorned-wilderness', title: 'Dragonwilds Scorned Wilderness Raid: Release & Rewards',
    description: 'Scorned Wilderness launches September 15, 2026 with the Kuldra raid, floating islands, Runite gear and the climax of Kuldra’s Saga.',
    eyebrow: 'Announced 1.0 content', h1: 'Scorned Wilderness Raid Guide',
    answer: '<p><strong>Scorned Wilderness is the version 1.0 raid update launching September 15, 2026.</strong> Players will cross anima-torn floating islands, survive attacks from Kuldra and earn the right to challenge the God-Eater alone or with allies.</p>',
    sections: [panel('Confirmed raid structure', '<p>Jagex describes a high-end gauntlet rather than another open exploration continent. The route crosses a landscape torn apart by wild anima and Black Dragons, with Kuldra attacking before the final confrontation. The team is deliberately withholding detailed mechanics to preserve the first clear.</p>'), panel('Confirmed reward families', '<ul><li>Ancestral Robes</li><li>Black Dragonhide gear</li><li>Rune Armour</li><li>Latest Dragon Shield version</li><li>Completion cape</li><li>Dragon armour pieces including Dragon Scimitar and Dragon Crossbow</li></ul><p>Exact recipes and rare-drop-table items remain unannounced.</p>')],
    sources: ['road121'], related: [['Release date', '/release-date/'], ['0.12.1 update', '/updates/0-12-1/'], ['Boss preparation', '/boss-prep/']]
  }
];

const categoryHubs = [
  {
    slug: 'combat', title: 'Dragonwilds Combat Guides: 0.12.1 and Version 1.0',
    description: 'Dragonwilds combat hub covering the 0.12.1 improvements and version 1.0 systems including Special Attacks, Wands and parrying.',
    eyebrow: 'Guide hub', h1: 'Dragonwilds Combat Guides',
    answer: '<p><strong>Combat changes are split between update 0.12.1 and version 1.0.</strong> Use this hub to distinguish live mechanics from announced hotwheels, weapon upgrades, Special Attacks, Wands and parry rewards.</p>',
    sections: [panel('Choose the correct guide', '<ul><li><a href="/combat/0-12-1-rework/">Complete combat rework timeline</a></li><li><a href="/combat/special-attacks/">Special Attack bar</a></li><li><a href="/combat/wands/">Wands versus Staves</a></li><li><a href="/combat/parrying/">Parrying and Visceral Attacks</a></li></ul>'), panel('Version-sensitive advice', '<p>Stamina costs, block windows, animation cancelling and movement during spell casts are changing. Every boss or build recommendation should name the tested game version so current 0.12 controls are not mixed with September 1.0 announcements.</p>')],
    sources: ['combat'], related: [['Boss preparation', '/boss-prep/'], ['Weapons and armour', '/weapons-armor/'], ['0.12.1 update', '/updates/0-12-1/']]
  },
  {
    slug: 'systems', title: 'Dragonwilds Systems Guides: Health, Food and Survival',
    description: 'Dragonwilds system guides covering the live health rework, Constitution Shrine progression, food healing and survival preparation.',
    eyebrow: 'Guide hub', h1: 'Dragonwilds Systems Guides',
    answer: '<p><strong>Update 0.12 replaced Wardshield progression with one scalable health pool.</strong> Constitution Shrines raise maximum HP, food heals instantly and fish lead in raw healing value.</p>',
    sections: [panel('Current system guides', '<ul><li><a href="/systems/health-rework/">Complete health and Wardshield change</a></li><li><a href="/systems/constitution-shrines/">Constitution Shrine progression</a></li><li><a href="/systems/food-healing/">Food, fish and potion changes</a></li></ul>'), panel('Why the cluster matters', '<p>Old launch guides can recommend Wardstones or healing-potion stockpiles that no longer match the live build. This cluster keeps the permanent progression, inventory healing and environmental survival answers separate.</p>')],
    sources: ['health'], related: [['Survival systems', '/survival-systems/'], ['Fishing', '/fishing/'], ['Boss preparation', '/boss-prep/']]
  },
  {
    slug: 'skills', title: 'Dragonwilds Skills Guide: Mining, Woodcutting and Agility',
    description: 'Dragonwilds skill hub for Mining and Woodcutting levels 50–99, key spells, storage unlocks and the announced Agility skill.',
    eyebrow: 'Skill hub', h1: 'Dragonwilds Skill Progression',
    answer: '<p><strong>The current upper-level depth is strongest in Mining and Woodcutting, while Agility is announced for 0.12.1.</strong> These guides connect each exact unlock to farming, storage and traversal.</p>',
    sections: [panel('Skill guides', '<ul><li><a href="/skills/mining-50-99/">Mining levels 50–99</a></li><li><a href="/skills/divine-rock/">Divine Rock spell</a></li><li><a href="/skills/woodcutting-50-99/">Woodcutting levels 50–99</a></li><li><a href="/skills/trunk-totem/">Trunk Totem spell</a></li><li><a href="/skills/agility/">Agility release status</a></li></ul>'), panel('Quality boundary', '<p>Future level pages need a confirmed effect, recipe or practical decision. Empty “level 60 guide” variants will not be indexed merely to increase URL count.</p>')],
    sources: ['update12', 'road121'], related: [['Skills and builds', '/skills-builds/'], ['Resources', '/resources/'], ['0.12.1 update', '/updates/0-12-1/']]
  },
  {
    slug: 'buildings', title: 'Dragonwilds Buildings and Processing Stations Guide',
    description: 'Dragonwilds building hub for mineral and lumber storage, Advanced Tannery, Fermentation Barrel and specialized crafting stations.',
    eyebrow: 'Building hub', h1: 'Buildings and Processing Stations',
    answer: '<p><strong>Update 0.12 adds dedicated storage and processing stations alongside the equipment-crafting rework.</strong> Choose a guide based on whether the bottleneck is storage, leather processing, potion upgrades or final crafting.</p>',
    sections: [panel('Building guides', '<ul><li><a href="/buildings/ore-stone-storage/">Ore & Stone Storage</a></li><li><a href="/buildings/lumber-storage/">Lumber Storage</a></li><li><a href="/buildings/advanced-tannery/">Advanced Tannery</a></li><li><a href="/buildings/fermentation-barrel/">Fermentation Barrel</a></li><li><a href="/crafting-stations/">Blacksmith, Fletching, Mystic and Armour stations</a></li></ul>'), panel('Base-flow principle', '<p>Place gathering storage near the return route and the stations that consume its materials. Processing stations should sit between raw storage and final crafting so a larger base does not add unnecessary travel to every recipe.</p>')],
    sources: ['update12'], related: [['Base building', '/base-building/'], ['Recipes', '/recipes/'], ['Resources', '/resources/']]
  },
  {
    slug: 'equipment', title: 'Dragonwilds Equipment Guide: Armour, Yew Gear and Backpacks',
    description: 'Dragonwilds equipment hub for Umbral Sands Vestige sets, Infinity Robes, Yew weapons and the level 78 Lumber Backpack.',
    eyebrow: 'Equipment hub', h1: 'Dragonwilds Equipment Guides',
    answer: '<p><strong>Umbral Sands expands all three combat styles and adds specialized gathering equipment.</strong> This hub separates confirmed equipment roles from unverified stats or best-in-slot claims.</p>',
    sections: [panel('Equipment guides', '<ul><li><a href="/equipment/vestige-armour-sets/">Four Vestige armour sets by combat style</a></li><li><a href="/equipment/infinity-robes/">Infinity Robes</a></li><li><a href="/equipment/yew-weapons/">Yew bows, stock and fishing rod</a></li><li><a href="/equipment/lumber-backpack/">Lumber Backpack</a></li></ul>'), panel('Crafting path', '<p>Ranged weapons use the Fletching Bench, armour uses the Armour Bench, and Vestiges or magic weapons use the Mystic Forge. Material processing can require a separate station before final equipment appears.</p>')],
    sources: ['update12'], related: [['Weapons and armour', '/weapons-armor/'], ['Crafting stations', '/crafting-stations/'], ['Adamant gear', '/adamant-gear/']]
  },
  {
    slug: 'enemies', title: 'Dragonwilds Enemies and Bosses Guide',
    description: 'Dragonwilds enemy hub covering the Umbral Sands roster, Fuzan, Tok-Xil, Red Dragon, Kalphite Queen and verified patch context.',
    eyebrow: 'Enemy hub', h1: 'Enemies and Bosses',
    answer: '<p><strong>The current expansion cluster focuses on Umbral Sands.</strong> Four named bosses or mini-bosses lead a roster of Kalphites, KotHaar and desert wildlife.</p>',
    sections: [panel('Verified guides', '<ul><li><a href="/enemies/umbral-sands/">Complete Umbral Sands roster</a></li><li><a href="/fuzan/">Fuzan unlock path</a></li><li><a href="/enemies/tok-xil/">Tok-Xil patch status</a></li><li><a href="/enemies/kalphite-queen/">Kalphite Queen overview</a></li><li><a href="/enemies/red-dragon/">Red Dragon overview</a></li></ul>'), panel('Why some enemies have no page', '<p>A useful enemy page needs more than a name. Regular-enemy URLs wait for verified location, weakness, drops and combat behavior; until then they remain discoverable on the regional roster without creating thin sitemap entries.</p>')],
    sources: ['update12', 'vital12'], related: [['Boss preparation', '/boss-prep/'], ['Fight Cave', '/fight-cave/'], ['Umbral Sands', '/umbral-sands/']]
  },
  {
    slug: 'mounts', title: 'Dragonwilds Mounts Guide: Magic Carpet and Unlock Rules',
    description: 'Dragonwilds mount hub explaining the Magic Carpet, Moon Garou rewards and The Wild Hunt requirement for accessing mounts.',
    eyebrow: 'Mount hub', h1: 'Dragonwilds Mount Guides',
    answer: '<p><strong>The Magic Carpet comes from Moon Garou quests, but the mount system still requires The Wild Hunt in Fellhollow.</strong> Earning a skin first does not bypass that prerequisite.</p>',
    sections: [panel('Available guide', '<p><a href="/mounts/magic-carpet/">The Magic Carpet guide</a> explains the two-part quest requirement and the launch-era interface confusion around greyed-out variants.</p>'), panel('Future mount pages', '<p>Individual variation pages should only be indexed when the exact source, prerequisite and cosmetic distinction are verified. Repeating the same generic mount text across skins would not help players.</p>')],
    sources: ['update12', 'vital12'], related: [['Quests', '/quests/'], ['Map guide', '/map/'], ['Umbral Sands', '/umbral-sands/']]
  }
];

for (const entry of categoryHubs) {
  const target = path.join(root, entry.slug, 'index.html');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, render(entry));
}

for (const entry of pages) {
  const target = path.join(root, entry.slug, 'index.html');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, render(entry));
}

// Strengthen the existing hubs with crawlable links to the verified Phase 2 pages.
const hubLinks = {
  'updates': [['All current combat guides', '/combat/'], ['0.12.1 status', '/updates/0-12-1/'], ['Scorned Wilderness', '/scorned-wilderness/']],
  'skills-builds': [['All skill guides', '/skills/'], ['Mining 50–99', '/skills/mining-50-99/'], ['Woodcutting 50–99', '/skills/woodcutting-50-99/'], ['Agility status', '/skills/agility/']],
  'resources': [['Buildings and storage hub', '/buildings/'], ['Ore & Stone Storage', '/buildings/ore-stone-storage/'], ['Lumber Storage', '/buildings/lumber-storage/'], ['Yew equipment', '/equipment/yew-weapons/']],
  'weapons-armor': [['All equipment guides', '/equipment/'], ['Vestige armour sets', '/equipment/vestige-armour-sets/'], ['Infinity Robes', '/equipment/infinity-robes/'], ['Lumber Backpack', '/equipment/lumber-backpack/']],
  'survival-systems': [['All system guides', '/systems/'], ['Health rework', '/systems/health-rework/'], ['Constitution Shrines', '/systems/constitution-shrines/'], ['Food healing', '/systems/food-healing/']],
  'dungeons-vaults': [['All enemy guides', '/enemies/'], ['Umbral Sands enemies', '/enemies/umbral-sands/'], ['Kalphite Queen', '/enemies/kalphite-queen/'], ['Tok-Xil', '/enemies/tok-xil/']]
};
for (const [slug, links] of Object.entries(hubLinks)) {
  const file = path.join(root, slug, 'index.html'); let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/\s*<!-- PHASE2_LINKS_START -->[\s\S]*?<!-- PHASE2_LINKS_END -->/, '');
  const block = `<!-- PHASE2_LINKS_START -->${panel('Verified Phase 2 guides', `<ul>${links.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>`)}<!-- PHASE2_LINKS_END -->`;
  html = html.replace('</article>', `${block}</article>`); fs.writeFileSync(file, html);
}

// Build sitemap from canonical indexable HTML only.
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
const sitemapEntries = [];
for (const file of walk(root).filter((file) => file.endsWith('index.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  if (/name="robots"\s+content="[^"]*noindex/i.test(html)) continue;
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if (canonical?.startsWith(`${site}/`)) sitemapEntries.push(canonical);
}
sitemapEntries.sort((a, b) => a === `${site}/` ? -1 : b === `${site}/` ? 1 : a.localeCompare(b));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.map((url) => `  <url><loc>${url}</loc><lastmod>${reviewed}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
console.log(`Generated ${pages.length} Phase 2 detail pages and ${categoryHubs.length} hubs; sitemap now contains ${sitemapEntries.length} URLs.`);
