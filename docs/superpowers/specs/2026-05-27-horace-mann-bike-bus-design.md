# Horace Mann Bike Bus — Site Design

**Date:** 2026-05-27
**Project:** `horace-mann-bike-bus` (new Astro site)

## Purpose

A simple, image-forward blog for the Horace Mann Bike Bus. Each "post" is a record of a ride — primarily photos, with light context. The site doubles as an info hub so new families can find the route, meeting time, and how to get in touch.

**Core message: joy.** The Horace Mann Bike Bus is about kids having fun on bikes — bubbles, going slow, staying safe — while learning how to ride confidently on real streets. Every page should reinforce that this is a joyful, safe, family thing. Not a hardcore cycling club. Not a commute hack. A weekly burst of delight that happens to teach a life skill.

## Goals & Non-Goals

**Goals**
- Communicate joy + safety as the core identity — every page should feel like fun-on-bikes, not a transportation initiative.
- Show the most recent ride front-and-center on the home page.
- Explain clearly what a bike bus is and why we do it (for first-time visitors).
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
1. **Joy banner** — short, bold tagline at the very top of the page:
   > "Bubbles. Big smiles. Going slow. We ride together so our kids learn the road."
   Reinforces the core message before anyone scrolls.
2. **Hero — Latest Ride**
   - Large cover image (optimized via `<Image>`).
   - Ride title, formatted date, rider count if present, `notes` blurb.
   - 3–4 thumbnails from `gallery` as a preview.
   - "See full ride →" link to `/rides/[slug]`.
3. **Route & Meeting card** — short text + embedded Google Map iframe.
4. **Join us card** — Instagram CTA (`@horace_mann_bike_bus`) with icon.
5. **Recent rides strip** — 3 most recent `RideCard`s under hero, with "All rides →" link.

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
A longer page, structured for someone discovering the bike bus for the first time. Sections in order:

1. **What is a bike bus?**
   A 2–3 paragraph plain-language explainer:
   - It's a group of kids and parents biking together to school on a set route at a set time.
   - Anyone along the route can join — we pick up riders at intersections like a bus.
   - We go slow, we stay in a group, we follow traffic rules, and we make it fun.
   - Bubbles, music, helmets, high-vis. The whole point is joy + safety, together.

2. **Why we do it**
   The intention behind the bus:
   - To give kids a confident, repeated experience of riding on real streets with adults who know how to do it safely.
   - To turn school drop-off into something kids look forward to instead of something they're driven through.
   - To show that streets can belong to families, not just cars.
   - To build a small piece of community — neighbors who know each other by name.

3. **How we keep it safe**
   - Adult ride leader at the front, sweep at the back.
   - We ride single file or two-by-two depending on the street.
   - Helmets required for kids, encouraged for adults.
   - We stop together, we wait together, we cross together.
   - Younger kids ride next to a parent or in a cargo bike.

4. **The Route** — written description + embedded Google Map iframe (placeholder src, easy to swap).
5. **Meeting Time & Place** — day(s) of week, time, address (placeholder values for user to edit).
6. **FAQ** — at least the following questions, each with a short, parent-friendly answer:
   - *What if my kid can't ride very well yet?* — That's exactly who this is for. Come ride with us. We go slow. Parents ride alongside their kids. Cargo bikes and trail-a-bikes welcome.
   - *What if it rains?* — We post on Instagram the morning of if we're cancelling.
   - *Do we need to RSVP?* — No. Just show up at any point on the route.
   - *What kind of bike does my kid need?* — Anything that rolls and has working brakes. Scooters welcome too.
   - *Is there a cost?* — No. It's free. It's neighbors.
   - *Can I join if my kid doesn't go to Horace Mann?* — Yes.
   - *How can I help?* — DM us on Instagram. We always need more adult ride marshals.
7. **Contact** — "DM us on Instagram [@horace_mann_bike_bus](https://instagram.com/horace_mann_bike_bus)". No email.

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

- **Personality:** joyful, school-community, daylight-cheerful, a little playful — not corporate, not edgy, not sporty/aggressive.
- **Palette — Horace Mann colors:**
  - Primary: **purple** (Horace Mann purple — use a rich school purple around `#5b2d8c` / `#6b21a8` family; tune in impl)
  - Neutral: **grey** (medium body text and dividers, e.g. slate-600 family)
  - Background: **white** (clean, lots of whitespace; photos do the visual work)
  - Accent: a lighter purple tint for hovers/highlights
  - Used sparingly to avoid feeling heavy — purple for headers, buttons, links, IG icon; grey for secondary text; white everywhere else.
- **Type:** system sans for body; one display sans (e.g. via Google Fonts: `Fraunces`, `Outfit`, or `Nunito`) for headers — pick something friendly/rounded that matches the joy tone. Decide during impl.
- **Photography over decoration:** ride photos are the visual hero of every page. Avoid heavy patterns, gradients, or decorative SVGs that compete with photos.
- **Mobile-first:** parents will check on phones. Hero image scales full-width; nav collapses to a small menu on narrow screens.
- **Accessibility:** semantic landmarks, alt text required on cover/gallery images (enforced by schema later if needed), color-contrast AA — check purple-on-white meets AA for body text; darken if needed.

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
