# AdSense sitewide configuration

Configured: 2026-07-18

- Publisher account: `ca-pub-9505220977121599`
- The asynchronous AdSense loader is injected once into the `<head>` of every HTML page.
- The `google-adsense-account` ownership meta tag is injected once into every HTML page.
- Root `/ads.txt` contains the exact Google publisher declaration.
- Configuration runs after every page-generation step, including English, German and French pages.
- The SEO audit fails the build if a sitemap page loses either tag, duplicates a tag, or if `ads.txt` changes unexpectedly.

After deployment, verify these public URLs before clicking **Verify** in AdSense:

- `https://runescapedragonwilds.wiki/ads.txt`
- `view-source:https://runescapedragonwilds.wiki/`
- `view-source:https://runescapedragonwilds.wiki/de/`
- `view-source:https://runescapedragonwilds.wiki/fr/`
