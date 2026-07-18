# Nivalis Nights Wiki — SEO round 3

Completed July 18, 2026. Steam release target: September 29, 2026.

## Outcome

- Quality-approved sitemap URLs: **90 → 112**.
- Added **20 new generated guides** and connected them through stronger hub cards; the recovered build also contained two valid canonical pages beyond the previous report count, so the audited sitemap now totals 112.
- New clusters: Skyhigh Gardens, Calypso Island, Metro Hub, flying taxis, apartment rentals and types, home-location factors, furniture vendors and materials, interior-design jobs, vendors and discounts, business partnerships, market events, day/night opportunities, relationship outcomes, district expansion and fishing spots.
- Caleb was intentionally not published: the official material only mentions the name in Salt Pete dialogue and does not yet support a useful standalone guide.

## Technical validation

- `npm run build` regenerated every page and sitemap entry.
- Final audit passed **112 content pages**.
- Checks passed: unique title, meta description, H1 and canonical; Article/Breadcrumb schema; concrete top answer; minimum visible depth; internal-link integrity; no repeated long paragraphs; no editorial placeholders; exact sitemap/canonical parity.
- Every new page uses a meaningful July 18 last-modified date; unchanged older pages preserve their prior date.

## Search architecture added

| Cluster | New URLs | Search intent |
|---|---:|---|
| Districts and transport | 5 | named district, island, hub, taxi and restaurant queries |
| Housing and decoration | 7 | rental rules, housing types, location factors, shopping and client work |
| Economy and relationships | 6 | vendors, discounts, partnerships, market events and relationship effects |
| Systems and strategy | 2 | day/night opportunities and fishing expansion |

## Evidence and quality decisions

- Skyhigh Gardens facts come from the official September 2025 district preview: hanging gardens, bridges, torii gates, Japanese food, flying taxi access and The Metro Hub.
- Housing pages use the official August 2025 apartment preview: unlimited-by-wallet rentals, studios, lofts, Calypso Island houses, furniture vendors and paid client decorating.
- Economy pages use the official community Q&A: vendor loyalty may improve prices, business relationships can open opportunities, and events can affect markets.
- Pages clearly distinguish confirmed mechanics from launch details that still require testing. No prices, schedules, quest names, scoring formulas or map routes were invented.

## Next round priorities

1. Deploy and submit the new sitemap, then inspect `/skyhigh-gardens/`, `/calypso-island/`, `/interior-design-jobs/`, `/vendors/`, `/market-events/` and `/relationship-story-effects/` in Search Console.
2. Build a release-data ingestion format for the four large databases: quests, ingredients, meals and furniture.
3. Use new official spotlights only when they provide enough named facts for a distinct page; otherwise enrich an existing hub rather than creating a thin URL.

## Official evidence

- Steam store: <https://store.steampowered.com/app/1488490/Nivalis_Nights/>
- ION LANDS news and community Q&A: <https://steamcommunity.com/app/1488490/allnews/>
- 505 Games publisher page: <https://505games.com/games/nivalisgame/>
