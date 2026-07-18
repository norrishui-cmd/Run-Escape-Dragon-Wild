# Nivalis Nights Guide

English strategy and SEO guide site for **Nivalis Nights**.

## Deploy To GitHub Pages

1. Create a new GitHub repository.
2. Upload all files in this folder to the repository root.
3. Open repository **Settings**.
4. Go to **Pages**.
5. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Save and wait for GitHub Pages to publish.

Your site will usually be available at:

```text
https://nivalisnights.wiki/
```

## Custom Domain

This package includes a `CNAME` file for:

```text
nivalisnights.wiki
```

In your domain DNS provider, point the domain to GitHub Pages according to GitHub's current custom domain instructions. After DNS resolves, add the domain in **Settings -> Pages -> Custom domain** if GitHub has not detected it automatically.

## Google Search Console

After deployment:

1. Add `https://nivalisnights.wiki/` as a URL-prefix property in Google Search Console.
2. Verify ownership using your preferred method.
3. Submit this sitemap:

```text
https://nivalisnights.wiki/sitemap.xml
```

## Files

- `index.html` - complete static guide site
- `404.html` - fallback page for GitHub Pages
- `.nojekyll` - disables Jekyll processing
- `CNAME` - custom domain for GitHub Pages
- `robots.txt` - crawler rules and sitemap location
- `sitemap.xml` - GSC-ready sitemap using `https://nivalisnights.wiki/`
- `/about/` - editorial and source policy page
- `/release-date/` - release date hub
- `/beginner-guide/` - beginner guide
- `/money-guide/` - economy guide
- `/gameplay-systems/` - gameplay systems overview
- `/business-guide/` - business progression guide
- `/city-guide/` - city exploration and route planning guide
- `/day-night-weather/` - day-night and weather planning guide
- `/apartment-decorating/` - apartment and decorating guide
- `/platforms/` - platform status tracker
- `/fishing-guide/` - fishing guide
- `/romance-guide/` - romance guide
- `/system-requirements/` - PC requirements hub
- `/faq/` - FAQ page with structured data`n- `/nivalis-vs-nivalis-nights/` - naming clarity page`n- `/demo-guide/` - demo availability tracker`n- `/price-editions/` - price and editions tracker`n- `/steam-deck-controller/` - handheld and controller tracker`n- `/best-tips/` - spoiler-free tips hub`n- `/checklists/` - launch verification hub`n- `/known-issues/` - issues and patch tracker

## Notes

- No build step is required.
- No npm install is required.
- The page uses external Steam-hosted imagery and inline CSS/JavaScript.
- Research timestamp in the footer: July 3, 2026.
- Sitemap last modified date: July 15, 2026.

