import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://runescapedragonwilds.wiki';
const reviewed = '2026-07-18';
const official = {
  vital: ['Official 0.12 live fixes and known issues', 'https://dragonwilds.runescape.com/news/0.12-vital-info'],
  server: ['Official dedicated server how-to guide', 'https://dragonwilds.runescape.com/news/how-to-dedicated-servers']
};
const nav = `<header class="site-header"><a class="brand" href="/"><span class="brand-mark">DW</span><span>Dragonwilds Field Guide</span></a><nav aria-label="Primary navigation"><a href="/guides/">Guides</a><a href="/quests/">Quests</a><a href="/resources/">Resources</a><a href="/skills-builds/">Skills</a><a href="/troubleshooting/">Fixes</a><a href="/updates/">Updates</a></nav></header>`;
const footer = `<footer class="site-footer"><p><strong>Dragonwilds Field Guide</strong> is an unofficial fan resource and is not affiliated with Jagex.</p><p><a href="/about/">Editorial policy</a> · <a href="/sitemap.xml">Sitemap</a> · Status reviewed ${reviewed}</p></footer>`;
const panel = (h, body) => `<section class="content-panel"><h2>${h}</h2>${body}</section>`;

function render(p) {
  const url = `${site}/${p.slug}/`, parts = p.slug.split('/');
  const schema = {'@context':'https://schema.org','@graph':[
    {'@type':'TechArticle',headline:p.h1,description:p.description,dateModified:reviewed,mainEntityOfPage:url,author:{'@type':'Organization',name:'Dragonwilds Field Guide'}},
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:`${site}/`},...parts.map((x,i)=>({'@type':'ListItem',position:i+2,name:x.replaceAll('-',' '),item:`${site}/${parts.slice(0,i+1).join('/')}/`}))]}
  ]};
  const refs = p.sources.map(k=>`<li><a href="${official[k][1]}" rel="noopener noreferrer">${official[k][0]}</a></li>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${p.title}</title><meta name="description" content="${p.description}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><meta property="og:type" content="article"><meta property="og:title" content="${p.h1}"><meta property="og:description" content="${p.description}"><meta property="og:url" content="${url}"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body>${nav}<main class="page-main"><article><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/${parts[0]}/">${parts[0].replaceAll('-',' ')}</a><span>›</span><span>${p.h1}</span></nav><p class="eyebrow">${p.eyebrow}</p><h1>${p.h1}</h1><section class="quick-answer"><h2>Current answer</h2>${p.answer}</section>${p.sections.join('')}<aside class="source-box"><h2>Verification</h2><p>Status checked ${reviewed}. Apply the latest game and dedicated-server patches before diagnosing an issue as unresolved.</p><ul>${refs}</ul></aside>${panel('Related guides',`<ul>${p.related.map(([n,u])=>`<li><a href="${u}">${n}</a></li>`).join('')}</ul>`)}</article></main>${footer}</body></html>`;
}

const pages = [
  {
    slug:'troubleshooting/tree-graphics-distorted', title:'Dragonwilds Trees Distorted or Blooming: Engine.ini Fix',
    description:'Fix distorted or blooming trees in Dragonwilds by resetting Engine.ini in the local Windows configuration folder, following the official 0.12 guidance.',
    eyebrow:'Graphics fix', h1:'Trees Distorted or Blooming Fix',
    answer:'<p><strong>Close the game, open <code>%localappdata%\\RSDragonwilds\\Saved\\Config\\Windows</code>, delete <code>Engine.ini</code>, then restart Dragonwilds.</strong> Jagex published this reset for trees that bloom or distort as the player approaches.</p>',
    sections:[panel('Step-by-step reset','<ol><li>Exit Dragonwilds completely.</li><li>Press Windows + R and paste <code>%localappdata%\\RSDragonwilds\\Saved\\Config\\Windows</code>.</li><li>Back up <code>Engine.ini</code> if you have intentional custom settings.</li><li>Delete the active <code>Engine.ini</code>.</li><li>Launch the game so it generates a clean configuration.</li></ol>'),panel('What the reset changes','<p>The file stores local rendering configuration, so recreating it can clear a bad setting without touching world saves. Recheck graphics options afterward because custom changes may return to defaults. This is the official workaround for the reported HLOD/tree issue, not a general instruction to delete save data.</p>')],
    sources:['vital'],related:[['Troubleshooting hub','/troubleshooting/'],['Umbral Sands','/umbral-sands/'],['Updates','/updates/']]
  },
  {
    slug:'troubleshooting/achievements-not-unlocking', title:'Dragonwilds Achievements Not Unlocking: Patch Status',
    description:'Dragonwilds achievement unlock problems were addressed in 0.12.0.1 and later skillcape fixes; old achievements may not unlock retroactively.',
    eyebrow:'Achievement fix', h1:'Achievements Not Unlocking',
    answer:'<p><strong>Update the game to the latest build.</strong> Patch 0.12.0.1 addressed achievements not triggering, and 0.12.0.4 made crafting a skillcape trigger the level-99 achievement. Previously completed achievements were not guaranteed to unlock retroactively.</p>',
    sections:[panel('What to check','<ol><li>Confirm the client version is current.</li><li>If using a dedicated server, update it to the same version.</li><li>Repeat the trigger only when safe and practical.</li><li>For a level-99 achievement, craft the relevant skillcape on a current build.</li></ol>'),panel('Why an old character may still be missing one','<p>The official issue log warned that achievements would not unlock retroactively during the initial fix. A profile can therefore meet the condition historically without receiving the badge until a supported trigger occurs again. Do not delete a character or world merely to test this.</p>')],
    sources:['vital'],related:[['Troubleshooting hub','/troubleshooting/'],['Skills hub','/skills/'],['0.12.1 update','/updates/0-12-1/']]
  },
  {
    slug:'troubleshooting/fishing-spots-not-working', title:'Dragonwilds Fishing Spots Not Working: Current Fix Status',
    description:'Unusable fishing locations in Fellhollow and Brynmoor were fixed in Dragonwilds patch 0.12.0.4; update clients and servers before retesting.',
    eyebrow:'Fishing fix', h1:'Fishing Spots Not Working',
    answer:'<p><strong>Fishing locations that became unusable in Fellhollow and Brynmoor were fixed in patch 0.12.0.4.</strong> Update both the player client and dedicated server, then revisit the location.</p>',
    sections:[panel('Recovery order','<ol><li>Check the client version.</li><li>Restart and update the dedicated server if applicable.</li><li>Confirm every co-op player is on the same build.</li><li>Leave and re-enter the affected area before testing the fishing interaction again.</li></ol>'),panel('When it may be a different problem','<p>A fixed interaction bug does not guarantee every water ripple is a valid fishing spot or that the correct equipment is equipped. If the current patch is installed, compare the spot type and fishing method before reporting the old 0.12 launch issue as returned.</p>')],
    sources:['vital'],related:[['Fishing guide','/fishing/'],['Dedicated server version mismatch','/dedicated-servers/version-mismatch/'],['Troubleshooting hub','/troubleshooting/']]
  },
  {
    slug:'troubleshooting/adamant-bolts-recipe-locked', title:'Dragonwilds Adamant Bolts Recipe Locked: 0.12.0.4 Fix',
    description:'Adamant Bolts no longer require crafting Adamant Arrows first after Dragonwilds patch 0.12.0.4; update the game if the recipe remains blocked.',
    eyebrow:'Recipe fix', h1:'Adamant Bolts Recipe Locked',
    answer:'<p><strong>Patch 0.12.0.4 removed the unintended requirement to craft Adamant Arrows before Adamant Bolts.</strong> If the Bolt recipe still behaves that way, the client or server is probably on an older build.</p>',
    sections:[panel('What to do','<ol><li>Update Dragonwilds through Steam.</li><li>Update or restart the dedicated server.</li><li>Confirm the server and client version numbers match.</li><li>Reopen the appropriate ranged crafting station and check the recipe again.</li></ol>'),panel('Correct crafting context','<p>Ranged weaponry belongs at the Fletching Bench after the 0.12 station rework. The hotfix removed the Arrow prerequisite; it did not move ranged recipes back to an older general-purpose station.</p>')],
    sources:['vital'],related:[['Adamant gear','/adamant-gear/'],['Crafting stations','/crafting-stations/'],['Server version mismatch','/dedicated-servers/version-mismatch/']]
  },
  {
    slug:'troubleshooting/fuzan-shield-recipe', title:'Dragonwilds Fuzan Shield Recipe: Correct Shield Component',
    description:'The Fuzan Dragonfire Shield recipe was intended to use the Anti-Dragon Shield, not the Dragonblight Shield shown in the early 0.12 build.',
    eyebrow:'Recipe correction', h1:'Fuzan Shield Recipe Component',
    answer:'<p><strong>The intended component is the Anti-Dragon Shield.</strong> The early 0.12 recipe incorrectly showed the Dragonblight Shield; Jagex warned players not to consume Dragonblight Shields and scheduled a correction.</p>',
    sections:[panel('Safe action','<p>Update to the latest patch before crafting. If the interface still asks for a Dragonblight Shield, stop and verify the game/server version instead of sacrificing the rarer item. The warning exists specifically because the displayed component was wrong.</p>'),panel('Why old guides conflict','<p>Launch-day screenshots and recipe lists may preserve the incorrect component. Prefer the corrected live interface and official issue log. Recipe pages should carry a patch label whenever a required component changes.</p>')],
    sources:['vital'],related:[['Fuzan guide','/fuzan/'],['Crafting stations','/crafting-stations/'],['Troubleshooting hub','/troubleshooting/']]
  },
  {
    slug:'quests/contact-marker-wrong', title:'Dragonwilds Contact Quest Marker Wrong: Known Issue',
    description:'The Contact! quest marker can show an incorrect location or size in Umbral Sands; use the objective and environment instead of trusting its boundary.',
    eyebrow:'Quest stuck point', h1:'Contact! Quest Marker Is Wrong',
    answer:'<p><strong>The Contact! map marker is a confirmed known issue and can show the wrong location or size.</strong> Do not assume the entire marked boundary is an accurate search area.</p>',
    sections:[panel('How to continue safely','<ol><li>Read the current quest objective again.</li><li>Use named landmarks, dialogue and visible paths instead of the marker edge.</li><li>If playing on a dedicated server, confirm the server is current.</li><li>Avoid abandoning or restarting the quest solely because the marker looks too large or misplaced.</li></ol>'),panel('Related display problems','<p>The same quest also had Avisk texture issues and an invisible Chamber barrier on Medium graphics or below. If the marker leads to an apparently empty boundary, the obstacle may be a rendering problem rather than the wrong progression step.</p>')],
    sources:['vital'],related:[['Contact barrier invisible','/quests/contact-barrier-invisible/'],['Quest hub','/quests/'],['Umbral Sands','/umbral-sands/']]
  },
  {
    slug:'quests/contact-barrier-invisible', title:'Dragonwilds Contact Quest Barrier Invisible: Graphics Fix',
    description:'The Chamber barrier in the Contact! quest may be invisible on Medium graphics or lower; temporarily raise graphics and follow the objective path.',
    eyebrow:'Quest visibility issue', h1:'Contact! Chamber Barrier Invisible',
    answer:'<p><strong>The Chamber barrier can be invisible on Medium graphics settings and below.</strong> Temporarily raise the relevant graphics preset, reload the area and look for the barrier interaction along the objective route.</p>',
    sections:[panel('Workaround sequence','<ol><li>Open graphics settings before entering the Chamber area.</li><li>Raise the preset above Medium if the hardware can manage it.</li><li>Reload or leave and re-enter the area.</li><li>Follow the quest path and check the interaction point again.</li><li>Lower settings after passing if performance requires it.</li></ol>'),panel('Do not confuse two Contact issues','<p>The quest also has an inaccurate map-marker report. A wrong marker changes where you search; an invisible barrier hides an object at the progression point. Diagnose which symptom you have before changing settings or route.</p>')],
    sources:['vital'],related:[['Contact marker wrong','/quests/contact-marker-wrong/'],['Tree graphics fix','/troubleshooting/tree-graphics-distorted/'],['Quest hub','/quests/']]
  },
  {
    slug:'quests/beast-in-the-sand-trail-invisible', title:'Beast in the Sand Trail Invisible in Dragonwilds',
    description:'The sand VFX trail in Beast in the Sand can be invisible for client players; the host and quest objective can help guide progression.',
    eyebrow:'Co-op quest issue', h1:'Beast in the Sand Trail Invisible',
    answer:'<p><strong>The sand visual-effect trail is a confirmed issue for client players.</strong> If possible, have the host identify the trail and guide the group while affected clients follow the quest objective and host position.</p>',
    sections:[panel('Practical co-op workaround','<ol><li>Confirm whether the host can see the sand trail.</li><li>Let the host lead rather than splitting the group.</li><li>Stay within the intended quest area and avoid treating missing VFX as a failed trigger.</li><li>Update all clients and the server before the next attempt.</li></ol>'),panel('Why this differs from quicksand','<p>This problem concerns a quest guidance effect, not the general quicksand hazard. A missing trail can hide where the quest wants the party to go, while quicksand remains a world traversal danger with its own visual and movement behavior.</p>')],
    sources:['vital'],related:[['Quicksand guide','/quicksand/'],['Quest hub','/quests/'],['Dedicated server guide','/dedicated-servers/']]
  },
  {
    slug:'quests/lagra-wont-accept-items', title:'Lagra Won’t Accept Quest Items: Inventory Fix',
    description:'Lagra, Alcarrid’s Butcher, may refuse quest items when the player inventory is full; free at least one slot and retry the hand-in.',
    eyebrow:'Quest hand-in fix', h1:'Lagra Won’t Accept Quest Items',
    answer:'<p><strong>Free at least one inventory slot, then speak to Lagra again.</strong> Jagex confirmed that Alcarrid’s Butcher may not accept quest items when the player inventory is full.</p>',
    sections:[panel('Fast recovery','<ol><li>Move away from the dialogue.</li><li>Store, drop or consume a safe non-quest item.</li><li>Keep the required quest items in inventory.</li><li>Restart the conversation and choose the hand-in option again.</li></ol>'),panel('Why space is required','<p>The hand-in may need room to remove items, add a reward or update the inventory state. A full inventory can block that transaction even when every required quest item is present. Do not discard unique quest objects to make space.</p>')],
    sources:['vital'],related:[['Quest hub','/quests/'],['Umbral Sands','/umbral-sands/'],['Troubleshooting hub','/troubleshooting/']]
  },
  {
    slug:'quests/rogue-trader-map-icons', title:'Rogue Trader Map Icons Wrong After Picking Up Moonstone',
    description:'Rogue Trader map icons may display incorrectly if Moonstone was collected before the quest; rely on the active objective and current inventory state.',
    eyebrow:'Quest marker issue', h1:'Rogue Trader Map Icons Wrong',
    answer:'<p><strong>Collecting a Moonstone before starting Rogue Trader can make its map icons display incorrectly.</strong> The quest can hold a pre-existing item state that does not match the marker sequence.</p>',
    sections:[panel('How to avoid losing progress','<p>Keep the Moonstone, follow the written objective and verify whether the quest recognizes the item before searching every marker. Do not delete the item or restart the world only to force the map to look normal.</p>'),panel('Report useful evidence','<p>If the objective does not advance, record whether the Moonstone was collected before quest start, the current objective text, world type and patch number. That information distinguishes the known icon problem from a separate quest-trigger failure.</p>')],
    sources:['vital'],related:[['Quest hub','/quests/'],['Contact marker issue','/quests/contact-marker-wrong/'],['Troubleshooting hub','/troubleshooting/']]
  },
  {
    slug:'dedicated-servers/setup', title:'How to Set Up a Dragonwilds Dedicated Server',
    description:'Set up the free RuneScape Dragonwilds Dedicated Server product through Steam or SteamCMD, configure required values and start the world.',
    eyebrow:'Server setup', h1:'Dedicated Server Setup Guide',
    answer:'<p><strong>Install the free “RuneScape: Dragonwilds – Dedicated Servers” product, set Owner ID, Server Name, Default World Name and Admin Password, then start the server and search its exact world name.</strong></p>',
    sections:[panel('Installation path','<ol><li>Acquire the free server product in Steam, or install app 4019830 with SteamCMD.</li><li>Run the product through Steam or launch <code>RSDragonwilds.exe</code>.</li><li>Add <code>-log -NewConsole</code> to launch options for visible logs.</li><li>Edit the configuration while the server is stopped.</li><li>Start the server and wait for registration.</li></ol>'),panel('Choose a hosting model','<p>Jagex documents partner hosting, a computer at home, or a self-managed cloud machine. Home and cloud hosting require manual backups and networking work; the partner option reduces setup effort.</p>')],
    sources:['server'],related:[['Requirements','/dedicated-servers/requirements/'],['Configuration','/dedicated-servers/configuration/'],['Port forwarding','/dedicated-servers/port-forwarding/']]
  },
  {
    slug:'dedicated-servers/requirements', title:'Dragonwilds Dedicated Server Requirements: RAM, OS & Players',
    description:'Dragonwilds dedicated servers require a 64-bit Windows or Linux system and 2 GB RAM plus 1 GB per player, supporting up to six players.',
    eyebrow:'Server requirements', h1:'Dedicated Server Requirements',
    answer:'<p><strong>Use a 64-bit Windows or Linux system with 2 GB base RAM plus 1 GB per player.</strong> Two players require about 4 GB; the six-player maximum requires about 8 GB.</p>',
    sections:[panel('Memory table','<div class="table-wrap"><table><thead><tr><th>Players</th><th>Calculated RAM</th></tr></thead><tbody><tr><td>1</td><td>3 GB</td></tr><tr><td>2</td><td>4 GB</td></tr><tr><td>4</td><td>6 GB</td></tr><tr><td>6</td><td>8 GB</td></tr></tbody></table></div>'),panel('Other requirements','<p>The server product must match the client version, and home hosting needs reachable UDP ports through the firewall, router and ISP. Memory alone does not make a server publicly joinable.</p>')],
    sources:['server'],related:[['Setup guide','/dedicated-servers/setup/'],['Port forwarding','/dedicated-servers/port-forwarding/'],['Server not showing','/dedicated-servers/not-showing/']]
  },
  {
    slug:'dedicated-servers/port-forwarding', title:'Dragonwilds Dedicated Server Port Forwarding: UDP 7777',
    description:'Dragonwilds dedicated servers start at UDP port 7777; additional servers use 7778 and upward, requiring forwarding through every router.',
    eyebrow:'Network setup', h1:'Dedicated Server Port Forwarding',
    answer:'<p><strong>Forward UDP port 7777 for the first server.</strong> A second instance uses 7778 and subsequent servers continue upward. The port must pass through the host firewall and every router between the server and ISP.</p>',
    sections:[panel('Port checklist','<ol><li>Give the server machine a stable local IP.</li><li>Allow the selected UDP port in its firewall.</li><li>Forward that UDP port to the machine in every router layer.</li><li>Check whether the ISP uses restrictions or carrier-grade NAT.</li><li>Restart the server and test from an external connection.</li></ol>'),panel('Common failure pattern','<p>If other players can see the server in the public list but cannot join, Jagex identifies failed port forwarding as the likely cause. Opening TCP alone is insufficient because the documented server ports use UDP.</p>')],
    sources:['server'],related:[['Server not showing','/dedicated-servers/not-showing/'],['Setup guide','/dedicated-servers/setup/'],['Requirements','/dedicated-servers/requirements/']]
  },
  {
    slug:'dedicated-servers/configuration', title:'Dragonwilds DedicatedServer.ini Configuration Guide',
    description:'Configure Owner ID, Server Name, Default World Name, Admin Password and optional World Password in Dragonwilds DedicatedServer.ini.',
    eyebrow:'Server configuration', h1:'DedicatedServer.ini Configuration',
    answer:'<p><strong>Stop the server before editing.</strong> Required values are Owner ID, Server Name, Default World Name and Admin Password; World Password is optional. Changes made while the server runs will be lost.</p>',
    sections:[panel('File locations','<ul><li><strong>Linux:</strong> <code>RSDragonwilds/Saved/Config/Linux/DedicatedServer.ini</code></li><li><strong>Windows:</strong> create/copy the file under <code>RSDragonwilds/Saved/Config/WindowsServer/DedicatedServer.ini</code></li></ul>'),panel('Required values explained','<p>Owner ID is the player ID shown at the bottom of the in-game Settings menu; the server cannot start without it. Server Name labels the server, Default World Name labels the automatically created world, and the Admin Password grants management access. Protect that password because anyone who enters it becomes an admin until it changes.</p>')],
    sources:['server'],related:[['Setup guide','/dedicated-servers/setup/'],['Server not showing','/dedicated-servers/not-showing/'],['Move a world','/dedicated-servers/move-world/']]
  },
  {
    slug:'dedicated-servers/not-showing', title:'Dragonwilds Dedicated Server Not Showing in List',
    description:'If a Dragonwilds dedicated server is missing, verify versions, exact case-sensitive world name, mandatory config values and server logs.',
    eyebrow:'Server discovery fix', h1:'Dedicated Server Not Showing',
    answer:'<p><strong>Check version match first, then search the exact case-sensitive World Name in the Public tab.</strong> Confirm mandatory configuration values and inspect the server log if it still does not appear.</p>',
    sections:[panel('Diagnostic order','<ol><li>Compare the server version at the top of its log with the client version in the top-left corner.</li><li>Restart/update the server after every hotfix.</li><li>Search the exact World Name, including capitalization.</li><li>Verify Owner ID and all mandatory config values.</li><li>Read <code>RSDragonwilds/Saved/Logs/RSDragonwilds.log</code>.</li></ol>'),panel('Visible but not joinable','<p>If the server appears to other players but joining fails, move to the UDP port-forwarding checklist. Discovery and connectivity are different stages of the setup.</p>')],
    sources:['server'],related:[['Version mismatch','/dedicated-servers/version-mismatch/'],['Port forwarding','/dedicated-servers/port-forwarding/'],['Configuration','/dedicated-servers/configuration/']]
  },
  {
    slug:'dedicated-servers/version-mismatch', title:'Dragonwilds Dedicated Server Version Mismatch Fix',
    description:'Update the Dragonwilds server after every patch or hotfix and match its log version to the client version when a server disappears.',
    eyebrow:'Server update fix', h1:'Dedicated Server Version Mismatch',
    answer:'<p><strong>Update and restart the dedicated server until its log version matches the player client.</strong> A mismatch commonly makes the server disappear or prevents clients from joining after a hotfix.</p>',
    sections:[panel('Where to compare','<p>The server version appears at the top of its logs; the client version appears in the top-left corner of the game. Compare the complete version, not only the major 0.12 label.</p>'),panel('Why this repeats','<p>Dragonwilds Early Access can receive small hotfixes such as 0.12.0.4 or 0.12.0.6. The client may update automatically while a self-hosted server remains old. Make server updates part of the restart routine instead of treating each mismatch as a new network failure.</p>')],
    sources:['server','vital'],related:[['Server not showing','/dedicated-servers/not-showing/'],['Setup guide','/dedicated-servers/setup/'],['Fishing spots fix','/troubleshooting/fishing-spots-not-working/']]
  },
  {
    slug:'dedicated-servers/move-world', title:'How to Move a Dragonwilds World to a Dedicated Server',
    description:'Move a local Dragonwilds .sav world into RSDragonwilds/Saved/Savegames while the server is stopped, after backing up both locations.',
    eyebrow:'World migration', h1:'Move a World to a Dedicated Server',
    answer:'<p><strong>Stop the server, back up both save locations, empty the server Savegames folder, copy the local <code>.sav</code> file into it, then restart.</strong></p>',
    sections:[panel('Windows source and server destination','<ul><li><strong>Local source:</strong> <code>C:\\Users\\your_username\\AppData\\Local\\RSDragonwilds\\Saved\\SaveGames</code></li><li><strong>Server destination:</strong> <code>RSDragonwilds/Saved/Savegames</code></li></ul>'),panel('Safe migration sequence','<ol><li>Stop the dedicated server.</li><li>Copy every current server save to a separate backup folder.</li><li>Back up the local world.</li><li>Empty the server Savegames directory.</li><li>Copy the chosen local <code>.sav</code> file into it.</li><li>Start the server and verify the world before deleting any backup.</li></ol>')],
    sources:['server'],related:[['Backup saves','/dedicated-servers/backup-saves/'],['Configuration','/dedicated-servers/configuration/'],['Setup guide','/dedicated-servers/setup/']]
  },
  {
    slug:'dedicated-servers/backup-saves', title:'How to Back Up Dragonwilds Dedicated Server Saves',
    description:'Back up Dragonwilds dedicated-server worlds by copying .sav files from RSDragonwilds/Saved/Savegames while the server is stopped.',
    eyebrow:'World backup', h1:'Back Up Dedicated Server Saves',
    answer:'<p><strong>Stop the server and copy the desired world files from <code>RSDragonwilds/Saved/Savegames</code> to a separate drive or protected folder.</strong> Keep dated names so you can identify recovery points.</p>',
    sections:[panel('Backup checklist','<ol><li>Announce downtime and stop the server cleanly.</li><li>Open <code>RSDragonwilds/Saved/Savegames</code>.</li><li>Copy every world file needed for recovery.</li><li>Store the copy outside the live Savegames folder.</li><li>Add a date/build label without changing the active file.</li><li>Restart and confirm the live world still loads.</li></ol>'),panel('When to back up','<p>Create a recovery point before game updates, server migration, configuration experiments and world replacement. Partner hosting may provide managed progression protection, while self-hosted and cloud setups require the owner to manage backups.</p>')],
    sources:['server'],related:[['Move a world','/dedicated-servers/move-world/'],['Version mismatch','/dedicated-servers/version-mismatch/'],['Dedicated servers hub','/dedicated-servers/']]
  },
  {
    slug:'dedicated-servers/stations-disappearing', title:'Dragonwilds Server Crafting Stations Disappearing Fix',
    description:'Crafting and processing stations disappearing after a Dragonwilds dedicated-server restart was fixed in patch 0.12.0.6.',
    eyebrow:'Fixed server bug', h1:'Crafting Stations Disappearing',
    answer:'<p><strong>Update the dedicated server to patch 0.12.0.6 or later.</strong> Jagex lists the disappearing crafting/processing stations issue among the fixes in that build.</p>',
    sections:[panel('Recovery steps','<ol><li>Stop the server.</li><li>Back up world saves.</li><li>Update the server product.</li><li>Confirm its version matches all clients.</li><li>Restart and inspect the station locations before rebuilding anything.</li></ol>'),panel('Avoid duplicate rebuilding','<p>The earlier bug could leave invisible collision where a station disappeared. Rebuilding immediately risks overlapping objects or wasting materials. Patch and reload the original world first, then determine whether an actual replacement is needed.</p>')],
    sources:['vital','server'],related:[['Version mismatch','/dedicated-servers/version-mismatch/'],['Backup saves','/dedicated-servers/backup-saves/'],['Crafting stations','/crafting-stations/']]
  },
  {
    slug:'dedicated-servers/splinter-crash', title:'Dragonwilds Splinter Dedicated Server Crash Fix',
    description:'The Splinter skill-spell crash on Dragonwilds dedicated servers was fixed in patch 0.12.0.6; update server and clients before reuse.',
    eyebrow:'Fixed server crash', h1:'Splinter Crashes Dedicated Server',
    answer:'<p><strong>Patch the dedicated server to 0.12.0.6 or later.</strong> The official live-issue log lists the Splinter crash among the fixes in that version.</p>',
    sections:[panel('Safe recovery','<ol><li>Stop the affected server.</li><li>Back up the latest world save.</li><li>Update the server application.</li><li>Compare server and client versions.</li><li>Restart and test Splinter in a low-risk area before normal play resumes.</li></ol>'),panel('Older reports mention Willow','<p>The investigation first linked the crash to Splinter or cutting Willow Trees, then clarified it was not limited to Willow. Do not diagnose the current build from that early symptom alone; the durable action is version alignment.</p>')],
    sources:['vital','server'],related:[['Version mismatch','/dedicated-servers/version-mismatch/'],['Backup saves','/dedicated-servers/backup-saves/'],['Woodcutting guide','/skills/woodcutting-50-99/']]
  }
];

const hub = {
  slug:'troubleshooting', title:'Dragonwilds Troubleshooting: Quest, Recipe & Server Fixes',
  description:'Current Dragonwilds troubleshooting hub for quest blockers, recipes, achievements, graphics, fishing and dedicated-server problems.',
  eyebrow:'Problem-solving hub', h1:'Dragonwilds Troubleshooting',
  answer:'<p><strong>Start by updating the game and matching the dedicated-server version.</strong> Then choose the exact symptom below; each page distinguishes fixed patch issues from known workarounds.</p>',
  sections:[
    panel('Quest blockers','<ul><li><a href="/quests/contact-marker-wrong/">Contact! marker wrong</a></li><li><a href="/quests/contact-barrier-invisible/">Contact! barrier invisible</a></li><li><a href="/quests/beast-in-the-sand-trail-invisible/">Beast in the Sand trail missing</a></li><li><a href="/quests/lagra-wont-accept-items/">Lagra will not accept items</a></li><li><a href="/quests/rogue-trader-map-icons/">Rogue Trader map icons wrong</a></li></ul>'),
    panel('Game and recipe fixes','<ul><li><a href="/troubleshooting/tree-graphics-distorted/">Distorted trees</a></li><li><a href="/troubleshooting/achievements-not-unlocking/">Achievements not unlocking</a></li><li><a href="/troubleshooting/fishing-spots-not-working/">Fishing spots not working</a></li><li><a href="/troubleshooting/adamant-bolts-recipe-locked/">Adamant Bolts locked</a></li><li><a href="/troubleshooting/fuzan-shield-recipe/">Fuzan Shield component</a></li></ul>'),
    panel('Dedicated servers','<ul><li><a href="/dedicated-servers/setup/">Setup</a></li><li><a href="/dedicated-servers/not-showing/">Server not showing</a></li><li><a href="/dedicated-servers/stations-disappearing/">Stations disappearing</a></li><li><a href="/dedicated-servers/splinter-crash/">Splinter crash</a></li></ul>')
  ], sources:['vital','server'], related:[['Updates','/updates/'],['Quests','/quests/'],['Dedicated server overview','/dedicated-servers/']]
};

for (const p of [...pages, hub]) { const f=path.join(root,p.slug,'index.html'); fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f,render(p)); }

// Reverse-link the new clusters from established hubs.
const insertions = {
  'quests': [['Quest troubleshooting','/troubleshooting/'],['Contact! marker fix','/quests/contact-marker-wrong/'],['Beast in the Sand trail','/quests/beast-in-the-sand-trail-invisible/']],
  'dedicated-servers': [['Complete setup','/dedicated-servers/setup/'],['Configuration','/dedicated-servers/configuration/'],['Server not showing','/dedicated-servers/not-showing/'],['World backups','/dedicated-servers/backup-saves/']],
  'updates': [['Troubleshooting hub','/troubleshooting/'],['Achievements fix','/troubleshooting/achievements-not-unlocking/'],['Fishing interaction fix','/troubleshooting/fishing-spots-not-working/']]
};
for (const [slug,links] of Object.entries(insertions)) { const f=path.join(root,slug,'index.html'); let h=fs.readFileSync(f,'utf8'); h=h.replace(/\s*<!-- PHASE3_LINKS_START -->[\s\S]*?<!-- PHASE3_LINKS_END -->/,''); const b=`<!-- PHASE3_LINKS_START -->${panel('Round 3 problem-solving guides',`<ul>${links.map(([n,u])=>`<li><a href="${u}">${n}</a></li>`).join('')}</ul>`)}<!-- PHASE3_LINKS_END -->`; h=h.replace('</article>',`${b}</article>`); fs.writeFileSync(f,h); }

function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)])}
const urls=[]; for(const f of walk(root).filter(x=>x.endsWith('index.html'))){const h=fs.readFileSync(f,'utf8');if(/name="robots"\s+content="[^"]*noindex/i.test(h))continue;const c=h.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];if(c?.startsWith(`${site}/`))urls.push(c)}
urls.sort((a,b)=>a===`${site}/`?-1:b===`${site}/`?1:a.localeCompare(b)); fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${u}</loc><lastmod>${reviewed}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`Generated ${pages.length} Round 3 detail pages plus troubleshooting hub; sitemap now contains ${urls.length} URLs.`);
