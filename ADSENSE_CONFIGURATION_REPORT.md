# Nivalis Nights Wiki — full-site AdSense configuration

Completed July 18, 2026.

## Publisher configuration

- AdSense account: `ca-pub-9505220977121599`
- Every generated HTML page includes exactly one asynchronous AdSense loader in `<head>`.
- Every generated HTML page includes exactly one `google-adsense-account` meta tag.
- Root `/ads.txt` contains: `google.com, pub-9505220977121599, DIRECT, f08c47fec0942fa0`
- English, German, Japanese and the 404 page are covered.

## Build persistence

The configuration runs after the English and multilingual generators, so future `npm run build` executions reapply the same verified account information. Existing copies are removed before insertion to prevent duplicate scripts.

The SEO audit now fails if any HTML file is missing the account meta tag or loader, contains duplicate copies, or if the root `ads.txt` record changes.

## Deployment verification

After deploying the full package, confirm that `https://nivalisnights.wiki/ads.txt` returns the single publisher record as plain text. Then select either the AdSense code-snippet or meta-tag ownership method and request verification. AdSense crawling and review can still take time after a technically correct deployment.
