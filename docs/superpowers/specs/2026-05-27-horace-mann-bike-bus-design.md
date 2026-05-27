# Horace Mann Bike Bus — Site Design

**Date:** 2026-05-27
**Project:** `horace-mann-bike-bus` (new Astro site)

## Purpose

A simple, image-forward blog for the Horace Mann Bike Bus. Each "post" is a record of a ride — primarily photos, with light context. The site doubles as an info hub so new families can find the route, meeting time, and how to get in touch.

## Goals & Non-Goals

**Goals**
- Show the most recent ride front-and-center on the home page.
- Make it easy to browse past rides in chronological order.
- Provide enough info (route, meeting time, contact) that a new family can show up next ride.
- Easy to add a new ride: drop photos into a folder, write an MDX file, commit.
- Look friendly and trustworthy — this is a school community resource.

**Non-Goals**
- No comments, accounts, or user-generated content.
- No CMS — content is in the repo.
- No newsletter signup, RSS, analytics, or search in v1.
- No e-commerce, donations, or event RSVP.

## Stack

Mirrors `/Users/michaelkarric/Code/pause-blog` (recent established pattern):

- Astro 5
- `@astrojs/mdx` — content collection posts
- `@astrojs/cloudflare` adapter — deploy to Cloudflare Pages
- Tailwind v4 (via `@tailwindcss/vite`) + daisyUI for theming
- `astro:assets` + `sharp` for image optimization
- `astro-icon` + `@iconify-json/mdi` for icons (Instagram, etc.)
- `wrangler` (dev dep) for Cloudflare deploy
- `@astrojs/sitemap` for sitemap.xml

## Information Architecture

```
/                 — Home: featured most-recent ride + route/meeting info + IG link
/rides/           — Archive of all rides (newest first)
/rides/[slug]     — Individual ride post (full gallery + body)
/about/           — Route, meeting time, coordinators (Instagram-only contact)
```

Header nav: `Home · Rides · About · [IG icon link]`
Footer: Instagram link, contact note ("DM us on Instagram"), © year.

## Content Model

Single Astro content collection: `rides`.

**Schema** (`src/content.config.ts`):

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const rides = defineCollection({
  loader: glob({ base: "./src/content/rides", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    coverImage: image(),
    gallery: z.array(image()).default([]),
    riders: z.number().int().nonnegative().optional(),
    notes: z.string().optional(), // short summary used on cards & home hero
  }),
});

export const collections = { rides };
```

**Example file** (`src/content/rides/2026-05-22-foggy-friday.mdx`):

```yaml
---
title: "Foggy Friday"
date: 2026-05-22
coverImage: ./images/2026-05-22/cover.jpg
gallery:
  - ./images/2026-05-22/01.jpg
  - ./images/2026-05-22/02.jpg
riders: 18
notes: "A misty morning roll-up — biggest turnout yet."
---

Optional longer write-up in MDX here.
```

Photos live next to their post in `src/content/rides/images/<date>/`, so `astro:assets` can process them.

## Pages

### `/` (`src/pages/index.astro`)
1. **Hero — Latest Ride**
   - Large cover image (optimized via `<Image>`).
   - Ride title, formatted date, rider count if present, `notes` blurb.
   - 3–4 thumbnails from `gallery` as a preview.
   - "See full ride →" link to `/rides/[slug]`.
2. **Route & Meeting card** — short text + embedded Google Map iframe.
3. **Join us card** — Instagram CTA (`@horace_mann_bike_bus`) with icon.
4. **Recent rides strip** — 3 most recent `RideCard`s under hero, with "All rides →" link.

If no rides exist yet, show a friendly "First ride coming soon" placeholder instead of the hero.

### `/rides/` (`src/pages/rides/index.astro`)
Grid of `RideCard`s, newest first. Each card: cover image, title, formatted date, rider count.

### `/rides/[slug]` (`src/pages/rides/[...slug].astro`)
- Title, formatted date, rider count.
- Cover image (full-width).
- `Gallery` of all `gallery` images in a responsive CSS grid.
- MDX body content (if present).
- "← Back to all rides" link.

### `/about` (`src/pages/about.astro`)
- **The Route** — written description + embedded Google Map iframe (placeholder src, easy to swap).
- **Meeting Time & Place** — day(s) of week, time, address (placeholder values for user to edit).
- **Contact** — "DM us on Instagram [@horace_mann_bike_bus](https://instagram.com/horace_mann_bike_bus)". No email.
- **Safety / FAQ** — placeholder section the user can fill in or delete.

## Components

| Component             | Purpose                                                                 |
|-----------------------|-------------------------------------------------------------------------|
| `BaseHead.astro`      | `<head>` tags, meta, OG/Twitter, favicon, sitemap link                  |
| `Header.astro`        | Site title/logo, nav, IG icon link                                      |
| `Footer.astro`        | IG link, contact note, copyright                                        |
| `Layout.astro`        | Page shell wrapping `BaseHead` + `Header` + slot + `Footer`             |
| `RidePost.astro`      | Layout for individual ride post (used by `[...slug].astro`)             |
| `RideCard.astro`      | Card used on home recent-strip and archive grid                         |
| `RideHero.astro`      | Big hero used on home page for the latest ride                          |
| `Gallery.astro`       | Responsive image grid for `gallery[]`; uses `<Image>` for optimization  |
| `RouteInfo.astro`     | Meeting-time + embedded map card (used on home and /about)              |
| `InstagramLink.astro` | Small reusable IG link with icon (used in header, footer, CTAs)         |
| `FormattedDate.astro` | Reusable formatted date component (mirrors `pause-blog`)                |

## Image Handling

- All images go through `astro:assets` `<Image>` for responsive `srcset` + `webp` conversion via Sharp.
- Gallery layout: CSS grid, `aspect-square` thumbnails on archive; mixed aspect ratios allowed on individual ride pages (use `<Image>` `widths` for responsive sizing).
- No lightbox in v1 — clicking a gallery image opens the full-size image in a new tab. (Can add later.)

## Visual Design

- **Personality:** friendly, community-school, daylight-cheerful — not corporate, not edgy.
- **Palette:** white background, deep navy text, accent yellow (`#facc15`-ish) for buttons/links and safety-orange for hover. daisyUI custom theme.
- **Type:** system sans for body; one display sans (e.g. via Google Fonts: `Fraunces` or `Outfit`) for headers. Decide during impl.
- **Mobile-first:** parents will check on phones. Hero image scales full-width; nav collapses to a small menu on narrow screens.
- **Accessibility:** semantic landmarks, alt text required on cover/gallery images (enforced by schema later if needed), color-contrast AA.

## Seed Content

Scaffold ships with:
- 2 placeholder ride posts dated within the last month, with 3–4 royalty-free placeholder bike photos each (or solid-color SVG placeholders if no images bundled).
- About page text with bracketed `[TODO]` placeholders for meeting day/time/address.
- Map iframe with a placeholder Google Maps embed URL the user replaces.

User can delete or replace these on first commit.

## Build & Deploy

- `npm run dev` — local dev server.
- `npm run build` — Astro build using Cloudflare adapter.
- `npm run preview` — local preview of built site.
- Deploy via Cloudflare Pages connected to the git repo (same flow as `pause-blog`).

## Out of Scope (Future Ideas)

- RSS feed for rides.
- Email-based contact / mailing list.
- Photo lightbox / EXIF stripping pipeline.
- Auto-pull latest IG posts.
- Multi-language.

## Open Questions

None blocking implementation. User will swap in real placeholder values (meeting time, map URL, real photos) after scaffold lands.
