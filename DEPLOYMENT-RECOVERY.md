# Vercel deployment recovery

The failed deployment from commit `b4d4545` contained files from another website. Its build log referenced `nivalisnights.wiki`, German/Japanese localization and different generator names. Those files do not belong to this project.

## Required replacement method

Replace the repository contents with this complete package. Do not merge its files into the failed working tree, because obsolete generators and sitemap output may remain.

The correct build must print:

- `Dragonwilds project guard passed for runescapedragonwilds.wiki.`
- `generate-phase1.mjs`, `generate-phase2.mjs`, `generate-phase3.mjs`, `generate-locales.mjs`, and `configure-adsense.mjs`
- `Generated 16 German and 16 French pages`
- `Audited 125 canonical sitemap URLs`
- `Failures: 0; warnings: 0`

The build intentionally stops if it detects `nivalisnights.wiki` anywhere in the project.
