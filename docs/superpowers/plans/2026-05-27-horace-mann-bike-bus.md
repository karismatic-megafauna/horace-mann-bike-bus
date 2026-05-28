# Horace Mann Bike Bus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a joyful, image-forward Astro 5 blog for the Horace Mann Bike Bus, with a home page featuring the latest ride, a ride archive, a long-form About page (what a bike bus is, why we do it, safety, route, FAQ), and an Instagram link.

**Architecture:** Static-rendered Astro 5 site with one content collection (`rides`) of MDX posts. Each ride has a cover image and a gallery, processed by `astro:assets` + Sharp. Pages are Astro components composed from a small set of reusable building blocks (BaseHead/Header/Footer/Layout + RideCard/RideHero/Gallery/RouteInfo/InstagramLink). Tailwind v4 + daisyUI provide styling with a custom Horace Mann purple/grey/white theme. Deploys to Cloudflare Pages via the `@astrojs/cloudflare` adapter.

**Tech Stack:** Astro 5, `@astrojs/mdx`, `@astrojs/cloudflare`, `@astrojs/sitemap`, Tailwind v4 (`@tailwindcss/vite`), daisyUI v5, `astro-icon` + `@iconify-json/mdi`, Sharp, Wrangler (dev only).

**Reference spec:** `docs/superpowers/specs/2026-05-27-horace-mann-bike-bus-design.md`

**Project root:** `/Users/michaelkarric/Code/horace-mann-bike-bus` — all relative paths in this plan are from there. The directory already contains a `docs/` folder and is a git repo (init'd during brainstorming, one commit of the spec).

**Verification model:** This is a static site — no unit-test harness. Every task's "test" is one of: (1) `npm run build` succeeds, (2) `npm run dev` serves the page without errors, (3) `grep` confirms expected content appears in built HTML at `dist/`. Treat these checks the way you'd treat a passing test in TDD: run them, verify the expected output, and only then commit.

**Commits:** Use `--no-gpg-sign` on every `git commit` (per user's global preference). Commit at the end of each task using the message provided.

---

## File Structure

Files to create (all under project root):

```
package.json
astro.config.mjs
tsconfig.json
wrangler.jsonc
.gitignore
README.md
public/favicon.svg
scripts/seed-images.mjs
src/
  consts.ts                       — site-wide constants (title, IG URL, etc.)
  content.config.ts               — rides collection schema
  styles/global.css               — Tailwind import + daisyUI HM theme
  components/
    BaseHead.astro                — <head> tags
    Header.astro                  — site nav + IG link
    Footer.astro                  — IG link + contact + ©
    FormattedDate.astro           — date formatter
    InstagramLink.astro           — reusable IG link with icon
    RideCard.astro                — card used in archive + home strip
    RideHero.astro                — big hero used on home for latest ride
    Gallery.astro                 — responsive image grid
    RouteInfo.astro               — meeting time + embedded map card
  layouts/
    Layout.astro                  — base layout (BaseHead+Header+slot+Footer)
    RidePost.astro                — individual ride post layout
  pages/
    index.astro                   — home page
    about.astro                   — about page
    404.astro                     — friendly not-found page
    rides/index.astro             — ride archive
    rides/[...slug].astro         — individual ride post
  content/rides/
    2026-05-08-first-ride.mdx
    2026-05-22-foggy-friday.mdx
    images/2026-05-08/cover.jpg
    images/2026-05-08/01.jpg
    images/2026-05-08/02.jpg
    images/2026-05-08/03.jpg
    images/2026-05-22/cover.jpg
    images/2026-05-22/01.jpg
    images/2026-05-22/02.jpg
    images/2026-05-22/03.jpg
```

---

## Task 1: Scaffold project (package.json, configs, .gitignore)

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `wrangler.jsonc`
- Create: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "horace-mann-bike-bus",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "seed:images": "node scripts/seed-images.mjs"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^12.6.7",
    "@astrojs/mdx": "^4.3.4",
    "@astrojs/sitemap": "^3.5.1",
    "@tailwindcss/vite": "^4.1.8",
    "astro": "^5.13.5",
    "astro-icon": "^1.1.5",
    "daisyui": "^5.0.43",
    "sharp": "^0.34.2",
    "tailwindcss": "^4.1.8"
  },
  "devDependencies": {
    "@iconify-json/mdi": "^1.2.3",
    "wrangler": "^4.19.1"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://horacemannbikebus.example',
  integrations: [mdx(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: cloudflare(),
});
```

Note: `site` is a placeholder URL — user will change it to the real domain before deploying.

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `wrangler.jsonc`**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "horace-mann-bike-bus",
  "compatibility_date": "2025-01-01",
  "pages_build_output_dir": "./dist"
}
```

- [ ] **Step 5: Create `.gitignore`**

```
# build outputs
dist/
.astro/

# deps
node_modules/

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# environment
.env
.env.*
!.env.example

# misc
.DS_Store
.wrangler/
```

- [ ] **Step 6: Create `README.md`**

```markdown
# Horace Mann Bike Bus

A simple blog for the Horace Mann Bike Bus — photos from each ride, plus info on the route, meeting time, and how to join. Built with Astro 5.

Follow us on Instagram: [@horace_mann_bike_bus](https://instagram.com/horace_mann_bike_bus)

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:4321.

## Adding a new ride

1. Create a folder under `src/content/rides/images/<YYYY-MM-DD>/` and drop the ride photos in. Name the cover photo `cover.jpg` and the rest `01.jpg`, `02.jpg`, etc.
2. Create `src/content/rides/<YYYY-MM-DD>-<slug>.mdx`:

   ```yaml
   ---
   title: "Ride title"
   date: 2026-05-22
   coverImage: ./images/2026-05-22/cover.jpg
   gallery:
     - ./images/2026-05-22/01.jpg
     - ./images/2026-05-22/02.jpg
   riders: 18
   notes: "A short one-line blurb shown on cards and the home hero."
   ---

   Optional longer write-up in MDX here.
   ```

3. Commit. The home page automatically features the most recent ride.

## Deploy

This project uses the Cloudflare Pages adapter. After connecting the repo in Cloudflare, the build command is `npm run build` and the output directory is `dist`.

## Spec & plan

See `docs/superpowers/specs/` and `docs/superpowers/plans/`.
```

- [ ] **Step 7: Verify the file set**

Run:
```bash
ls -1 package.json astro.config.mjs tsconfig.json wrangler.jsonc .gitignore README.md
```
Expected: all six filenames echoed, no `ls: ... No such file` errors.

- [ ] **Step 8: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json wrangler.jsonc .gitignore README.md
git commit --no-gpg-sign -m "chore: scaffold Astro project config"
```

---

## Task 2: Install dependencies

**Files:** none (creates `node_modules/` and `package-lock.json`)

- [ ] **Step 1: Install**

Run:
```bash
npm install
```
Expected: completes without errors; creates `node_modules/` and `package-lock.json`.

If `npm install` fails on Sharp (occasionally happens on Apple Silicon), run:
```bash
npm install --include=optional sharp
```

- [ ] **Step 2: Verify Astro CLI works**

Run:
```bash
npx astro --version
```
Expected: prints a 5.x version string.

- [ ] **Step 3: Commit the lockfile**

```bash
git add package-lock.json
git commit --no-gpg-sign -m "chore: add package-lock.json"
```

---

## Task 3: Site constants

**Files:**
- Create: `src/consts.ts`

- [ ] **Step 1: Create `src/consts.ts`**

```ts
export const SITE_TITLE = "Horace Mann Bike Bus";
export const SITE_DESCRIPTION =
  "Bubbles, big smiles, and going slow. The Horace Mann Bike Bus rides together to school — teaching kids to bike safely on real streets.";
export const INSTAGRAM_HANDLE = "horace_mann_bike_bus";
export const INSTAGRAM_URL = "https://instagram.com/horace_mann_bike_bus";

// User should replace this with a real Google Maps "Embed a map" iframe src.
// See https://support.google.com/maps/answer/144361 for how to generate one.
export const ROUTE_MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3304.7!2d-118.4!3d34.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDAwJzAwLjAiTiAxMTjCsDI0JzAwLjAiVw!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus";

// Placeholder meeting details — user will edit these.
export const MEETING_DAY = "Fridays";
export const MEETING_TIME = "7:45 AM";
export const MEETING_PLACE = "Corner of [TODO street] and [TODO street]";
```

- [ ] **Step 2: Commit**

```bash
git add src/consts.ts
git commit --no-gpg-sign -m "feat: add site constants"
```

---

## Task 4: Tailwind + daisyUI theme

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: hmbike --default;
}

@plugin "daisyui/theme" {
  name: "hmbike";
  default: true;
  prefersdark: false;
  color-scheme: light;

  --color-base-100: #ffffff;
  --color-base-200: #f5f5f7;
  --color-base-300: #e5e7eb;
  --color-base-content: #1f2937;

  --color-primary: #5b2d8c;
  --color-primary-content: #ffffff;

  --color-secondary: #6b7280;
  --color-secondary-content: #ffffff;

  --color-accent: #a78bfa;
  --color-accent-content: #1f2937;

  --color-neutral: #374151;
  --color-neutral-content: #ffffff;

  --color-info: #5b2d8c;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;

  --radius-selector: 0.5rem;
  --radius-field: 0.5rem;
  --radius-box: 0.75rem;
}

/* Friendly headings */
h1, h2, h3, h4 {
  font-family: ui-sans-serif, system-ui, "Avenir Next", "Segoe UI", sans-serif;
  letter-spacing: -0.01em;
}
```

Note on the purple: `#5b2d8c` is a deep school-purple chosen to meet AA contrast on white for body links. If you tweak it, re-check contrast with a tool like https://webaim.org/resources/contrastchecker/.

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit --no-gpg-sign -m "feat: add Tailwind + daisyUI HM purple theme"
```

---

## Task 5: Content collection schema

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const rides = defineCollection({
  loader: glob({ base: "./src/content/rides", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      coverImage: image(),
      gallery: z.array(image()).default([]),
      riders: z.number().int().nonnegative().optional(),
      notes: z.string().optional(),
    }),
});

export const collections = { rides };
```

- [ ] **Step 2: Commit**

```bash
git add src/content.config.ts
git commit --no-gpg-sign -m "feat: define rides content collection"
```

---

## Task 6: Seed image generator script

We need placeholder JPGs for the seed ride posts so `npm run build` succeeds out of the box. This script generates simple solid-color JPGs using Sharp.

**Files:**
- Create: `scripts/seed-images.mjs`

- [ ] **Step 1: Create `scripts/seed-images.mjs`**

```js
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TARGET = join(ROOT, "src/content/rides/images");

// Each ride gets a cover + 3 gallery images. Colors cycle through HM-ish purples.
const RIDES = [
  { date: "2026-05-08", base: [91, 45, 140] },
  { date: "2026-05-22", base: [107, 33, 168] },
];

const TINTS = [0, 30, -25, 45]; // brightness offsets per image

async function makeJpeg(rgb, label, outPath) {
  const [r, g, b] = rgb.map((c) => Math.max(0, Math.min(255, c)));
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1067">
      <rect width="100%" height="100%" fill="rgb(${r},${g},${b})"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
            font-family="ui-sans-serif, system-ui, sans-serif"
            font-size="64" fill="rgba(255,255,255,0.85)">${label}</text>
    </svg>`,
  );
  const buf = await sharp(svg).jpeg({ quality: 82 }).toBuffer();
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, buf);
  console.log("wrote", outPath);
}

for (const { date, base } of RIDES) {
  const tint = (i) => base.map((c) => c + TINTS[i]);
  await makeJpeg(tint(0), `${date} cover`, join(TARGET, date, "cover.jpg"));
  await makeJpeg(tint(1), `${date} 01`, join(TARGET, date, "01.jpg"));
  await makeJpeg(tint(2), `${date} 02`, join(TARGET, date, "02.jpg"));
  await makeJpeg(tint(3), `${date} 03`, join(TARGET, date, "03.jpg"));
}
```

- [ ] **Step 2: Run the script**

```bash
npm run seed:images
```
Expected: prints 8 "wrote ..." lines and creates `src/content/rides/images/2026-05-08/{cover,01,02,03}.jpg` and `src/content/rides/images/2026-05-22/{cover,01,02,03}.jpg`.

- [ ] **Step 3: Verify the files exist**

```bash
ls src/content/rides/images/2026-05-08 src/content/rides/images/2026-05-22
```
Expected: each directory lists `01.jpg  02.jpg  03.jpg  cover.jpg`.

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-images.mjs src/content/rides/images
git commit --no-gpg-sign -m "feat: add seed image generator and placeholder ride photos"
```

---

## Task 7: Seed ride content (two MDX posts)

**Files:**
- Create: `src/content/rides/2026-05-08-first-ride.mdx`
- Create: `src/content/rides/2026-05-22-foggy-friday.mdx`

- [ ] **Step 1: Create `src/content/rides/2026-05-08-first-ride.mdx`**

```mdx
---
title: "First ride of the spring"
date: 2026-05-08
coverImage: ./images/2026-05-08/cover.jpg
gallery:
  - ./images/2026-05-08/01.jpg
  - ./images/2026-05-08/02.jpg
  - ./images/2026-05-08/03.jpg
riders: 12
notes: "Twelve kids, two cargo bikes, and a bottle of bubbles. Good start."
---

A small but mighty crew for our first ride of the season. Sunny, slow, and silly.
```

- [ ] **Step 2: Create `src/content/rides/2026-05-22-foggy-friday.mdx`**

```mdx
---
title: "Foggy Friday"
date: 2026-05-22
coverImage: ./images/2026-05-22/cover.jpg
gallery:
  - ./images/2026-05-22/01.jpg
  - ./images/2026-05-22/02.jpg
  - ./images/2026-05-22/03.jpg
riders: 18
notes: "A misty morning roll-up — our biggest turnout yet."
---

Eighteen riders despite the fog! A neighbor brought donut holes at the halfway corner. The kids cheered.
```

- [ ] **Step 3: Verify Astro picks up the collection**

Run:
```bash
npx astro sync
```
Expected: completes without schema errors. (`astro sync` regenerates `.astro/types.d.ts` and validates frontmatter against the schema.)

If you see "image not found" errors, double-check the `./images/...` paths in the frontmatter match the files you just created.

- [ ] **Step 4: Commit**

```bash
git add src/content/rides/2026-05-08-first-ride.mdx src/content/rides/2026-05-22-foggy-friday.mdx
git commit --no-gpg-sign -m "feat: add two seed ride posts"
```

---

## Task 8: Favicon

**Files:**
- Create: `public/favicon.svg`

- [ ] **Step 1: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="#5b2d8c"/>
  <circle cx="20" cy="44" r="9" fill="none" stroke="#ffffff" stroke-width="3"/>
  <circle cx="44" cy="44" r="9" fill="none" stroke="#ffffff" stroke-width="3"/>
  <path d="M20 44 L30 26 L44 44 M30 26 L38 26" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 2: Commit**

```bash
git add public/favicon.svg
git commit --no-gpg-sign -m "feat: add bike-themed favicon"
```

---

## Task 9: `BaseHead` component

**Files:**
- Create: `src/components/BaseHead.astro`

- [ ] **Step 1: Create `src/components/BaseHead.astro`**

```astro
---
import { SITE_TITLE } from "../consts";

type Props = {
  title: string;
  description: string;
  image?: string;
};

const { title, description, image } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const ogImage = image ? new URL(image, Astro.site) : undefined;
---

<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="sitemap" href="/sitemap-index.xml" />
<link rel="canonical" href={canonicalURL} />

<title>{title === SITE_TITLE ? title : `${title} — ${SITE_TITLE}`}</title>
<meta name="description" content={description} />

<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalURL} />
{ogImage && <meta property="og:image" content={ogImage} />}

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
{ogImage && <meta name="twitter:image" content={ogImage} />}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BaseHead.astro
git commit --no-gpg-sign -m "feat: add BaseHead component"
```

---

## Task 10: `FormattedDate` component

**Files:**
- Create: `src/components/FormattedDate.astro`

- [ ] **Step 1: Create `src/components/FormattedDate.astro`**

```astro
---
type Props = {
  date: Date;
};

const { date } = Astro.props;
const formatted = date.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
---

<time datetime={date.toISOString()}>{formatted}</time>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FormattedDate.astro
git commit --no-gpg-sign -m "feat: add FormattedDate component"
```

---

## Task 11: `InstagramLink` component

**Files:**
- Create: `src/components/InstagramLink.astro`

- [ ] **Step 1: Create `src/components/InstagramLink.astro`**

```astro
---
import { Icon } from "astro-icon/components";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "../consts";

type Props = {
  variant?: "icon" | "inline" | "cta";
  class?: string;
};

const { variant = "icon", class: className = "" } = Astro.props;
---

{variant === "icon" && (
  <a
    href={INSTAGRAM_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Instagram: @${INSTAGRAM_HANDLE}`}
    class={`inline-flex items-center text-primary hover:text-accent ${className}`}
  >
    <Icon name="mdi:instagram" class="w-6 h-6" />
  </a>
)}

{variant === "inline" && (
  <a
    href={INSTAGRAM_URL}
    target="_blank"
    rel="noopener noreferrer"
    class={`inline-flex items-center gap-1 text-primary hover:text-accent underline-offset-4 hover:underline ${className}`}
  >
    <Icon name="mdi:instagram" class="w-5 h-5" />
    <span>@{INSTAGRAM_HANDLE}</span>
  </a>
)}

{variant === "cta" && (
  <a
    href={INSTAGRAM_URL}
    target="_blank"
    rel="noopener noreferrer"
    class={`btn btn-primary gap-2 ${className}`}
  >
    <Icon name="mdi:instagram" class="w-5 h-5" />
    Follow @{INSTAGRAM_HANDLE}
  </a>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/InstagramLink.astro
git commit --no-gpg-sign -m "feat: add InstagramLink component"
```

---

## Task 12: `Header` component

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Create `src/components/Header.astro`**

```astro
---
import { SITE_TITLE } from "../consts";
import InstagramLink from "./InstagramLink.astro";

const pathname = Astro.url.pathname.replace(/\/$/, "") || "/";

const links = [
  { href: "/", label: "Home" },
  { href: "/rides", label: "Rides" },
  { href: "/about", label: "About" },
];

function isActive(href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
---

<header class="border-b border-base-300 bg-base-100">
  <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
    <a href="/" class="flex items-center gap-2 group">
      <span class="text-xl sm:text-2xl font-semibold text-primary group-hover:text-accent">
        {SITE_TITLE}
      </span>
    </a>
    <nav class="flex items-center gap-1 sm:gap-2">
      {links.map(({ href, label }) => (
        <a
          href={href}
          class:list={[
            "px-3 py-2 rounded-md text-sm sm:text-base hover:bg-base-200",
            isActive(href) ? "text-primary font-medium" : "text-base-content",
          ]}
        >
          {label}
        </a>
      ))}
      <InstagramLink variant="icon" class="ml-1 sm:ml-2" />
    </nav>
  </div>
</header>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.astro
git commit --no-gpg-sign -m "feat: add Header component"
```

---

## Task 13: `Footer` component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
import { SITE_TITLE } from "../consts";
import InstagramLink from "./InstagramLink.astro";

const year = new Date().getFullYear();
---

<footer class="mt-16 border-t border-base-300 bg-base-100">
  <div class="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div class="text-sm text-secondary">
      <p>© {year} {SITE_TITLE}.</p>
      <p>Questions? DM us on Instagram.</p>
    </div>
    <InstagramLink variant="inline" />
  </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit --no-gpg-sign -m "feat: add Footer component"
```

---

## Task 14: `Layout` component

**Files:**
- Create: `src/layouts/Layout.astro`

- [ ] **Step 1: Create `src/layouts/Layout.astro`**

```astro
---
import BaseHead from "../components/BaseHead.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import "../styles/global.css";

type Props = {
  title: string;
  description: string;
  image?: string;
};

const { title, description, image } = Astro.props;
---

<html lang="en">
  <head>
    <BaseHead title={title} description={description} image={image} />
  </head>
  <body class="bg-base-100 text-base-content min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 w-full">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit --no-gpg-sign -m "feat: add base Layout"
```

---

## Task 15: `RideCard` component

**Files:**
- Create: `src/components/RideCard.astro`

- [ ] **Step 1: Create `src/components/RideCard.astro`**

```astro
---
import { Image } from "astro:assets";
import type { CollectionEntry } from "astro:content";
import FormattedDate from "./FormattedDate.astro";

type Props = {
  ride: CollectionEntry<"rides">;
};

const { ride } = Astro.props;
const { data, id } = ride;
const slug = id.replace(/\.mdx?$/, "");
---

<a
  href={`/rides/${slug}`}
  class="group block rounded-box overflow-hidden bg-base-100 border border-base-300 hover:border-primary transition"
>
  <div class="aspect-[4/3] overflow-hidden bg-base-200">
    <Image
      src={data.coverImage}
      alt={`Cover photo from ${data.title}`}
      widths={[400, 800, 1200]}
      sizes="(min-width: 768px) 33vw, 100vw"
      class="w-full h-full object-cover group-hover:scale-[1.02] transition"
    />
  </div>
  <div class="p-4">
    <h3 class="text-lg font-semibold text-primary group-hover:text-accent">{data.title}</h3>
    <p class="text-sm text-secondary mt-1">
      <FormattedDate date={data.date} />
      {data.riders !== undefined && (
        <span> · {data.riders} {data.riders === 1 ? "rider" : "riders"}</span>
      )}
    </p>
  </div>
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RideCard.astro
git commit --no-gpg-sign -m "feat: add RideCard component"
```

---

## Task 16: `Gallery` component

**Files:**
- Create: `src/components/Gallery.astro`

- [ ] **Step 1: Create `src/components/Gallery.astro`**

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

type Props = {
  images: ImageMetadata[];
  alt: string;
};

const { images, alt } = Astro.props;
---

{images.length > 0 && (
  <div class="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
    {images.map((img, i) => (
      <a
        href={img.src}
        target="_blank"
        rel="noopener noreferrer"
        class="block aspect-square overflow-hidden rounded-box bg-base-200"
      >
        <Image
          src={img}
          alt={`${alt} — photo ${i + 1}`}
          widths={[400, 800]}
          sizes="(min-width: 768px) 33vw, 50vw"
          class="w-full h-full object-cover hover:scale-[1.02] transition"
        />
      </a>
    ))}
  </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Gallery.astro
git commit --no-gpg-sign -m "feat: add Gallery component"
```

---

## Task 17: `RideHero` component

**Files:**
- Create: `src/components/RideHero.astro`

- [ ] **Step 1: Create `src/components/RideHero.astro`**

```astro
---
import { Image } from "astro:assets";
import type { CollectionEntry } from "astro:content";
import FormattedDate from "./FormattedDate.astro";

type Props = {
  ride: CollectionEntry<"rides">;
};

const { ride } = Astro.props;
const { data, id } = ride;
const slug = id.replace(/\.mdx?$/, "");
const previewGallery = data.gallery.slice(0, 4);
---

<section class="bg-base-100">
  <div class="max-w-5xl mx-auto px-4 py-8">
    <p class="text-sm uppercase tracking-wide text-secondary font-medium">Latest ride</p>
    <h2 class="mt-1 text-3xl sm:text-4xl font-semibold text-primary">{data.title}</h2>
    <p class="mt-2 text-secondary">
      <FormattedDate date={data.date} />
      {data.riders !== undefined && (
        <span> · {data.riders} {data.riders === 1 ? "rider" : "riders"}</span>
      )}
    </p>

    <a href={`/rides/${slug}`} class="mt-6 block rounded-box overflow-hidden bg-base-200">
      <Image
        src={data.coverImage}
        alt={`Cover photo from ${data.title}`}
        widths={[600, 1000, 1600]}
        sizes="(min-width: 1024px) 960px, 100vw"
        class="w-full max-h-[520px] object-cover"
      />
    </a>

    {data.notes && (
      <p class="mt-4 text-lg text-base-content">{data.notes}</p>
    )}

    {previewGallery.length > 0 && (
      <div class="mt-6 grid grid-cols-4 gap-2 sm:gap-3">
        {previewGallery.map((img, i) => (
          <a
            href={`/rides/${slug}`}
            class="block aspect-square overflow-hidden rounded-md bg-base-200"
          >
            <Image
              src={img}
              alt={`${data.title} preview ${i + 1}`}
              widths={[200, 400]}
              sizes="25vw"
              class="w-full h-full object-cover"
            />
          </a>
        ))}
      </div>
    )}

    <div class="mt-6">
      <a href={`/rides/${slug}`} class="btn btn-primary">See full ride →</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RideHero.astro
git commit --no-gpg-sign -m "feat: add RideHero component"
```

---

## Task 18: `RouteInfo` component

**Files:**
- Create: `src/components/RouteInfo.astro`

- [ ] **Step 1: Create `src/components/RouteInfo.astro`**

```astro
---
import {
  MEETING_DAY,
  MEETING_PLACE,
  MEETING_TIME,
  ROUTE_MAP_EMBED_SRC,
} from "../consts";

type Props = {
  showMap?: boolean;
  heading?: string;
};

const { showMap = true, heading = "Where & when" } = Astro.props;
---

<section class="rounded-box border border-base-300 bg-base-100 overflow-hidden">
  <div class="p-6">
    <h3 class="text-xl font-semibold text-primary">{heading}</h3>
    <dl class="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-base-content">
      <div>
        <dt class="text-xs uppercase tracking-wide text-secondary">Day</dt>
        <dd class="mt-1 font-medium">{MEETING_DAY}</dd>
      </div>
      <div>
        <dt class="text-xs uppercase tracking-wide text-secondary">Time</dt>
        <dd class="mt-1 font-medium">{MEETING_TIME}</dd>
      </div>
      <div>
        <dt class="text-xs uppercase tracking-wide text-secondary">Meeting place</dt>
        <dd class="mt-1 font-medium">{MEETING_PLACE}</dd>
      </div>
    </dl>
  </div>
  {showMap && (
    <div class="aspect-[16/9] w-full bg-base-200">
      <iframe
        src={ROUTE_MAP_EMBED_SRC}
        title="Bike bus route map"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        class="w-full h-full border-0"
        allowfullscreen
      ></iframe>
    </div>
  )}
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RouteInfo.astro
git commit --no-gpg-sign -m "feat: add RouteInfo component"
```

---

## Task 19: `RidePost` layout

**Files:**
- Create: `src/layouts/RidePost.astro`

- [ ] **Step 1: Create `src/layouts/RidePost.astro`**

```astro
---
import { Image } from "astro:assets";
import type { CollectionEntry } from "astro:content";
import Layout from "./Layout.astro";
import FormattedDate from "../components/FormattedDate.astro";
import Gallery from "../components/Gallery.astro";

type Props = {
  ride: CollectionEntry<"rides">;
};

const { ride } = Astro.props;
const { data } = ride;
---

<Layout title={data.title} description={data.notes ?? `Photos from ${data.title}.`}>
  <article class="max-w-3xl mx-auto px-4 py-8">
    <a href="/rides" class="text-sm text-secondary hover:text-primary">← Back to all rides</a>

    <header class="mt-4">
      <h1 class="text-3xl sm:text-4xl font-semibold text-primary">{data.title}</h1>
      <p class="mt-2 text-secondary">
        <FormattedDate date={data.date} />
        {data.riders !== undefined && (
          <span> · {data.riders} {data.riders === 1 ? "rider" : "riders"}</span>
        )}
      </p>
    </header>

    <div class="mt-6 rounded-box overflow-hidden bg-base-200">
      <Image
        src={data.coverImage}
        alt={`Cover photo from ${data.title}`}
        widths={[600, 1000, 1600]}
        sizes="(min-width: 1024px) 768px, 100vw"
        class="w-full object-cover"
      />
    </div>

    {data.notes && (
      <p class="mt-6 text-lg text-base-content">{data.notes}</p>
    )}

    <div class="mt-6 text-base-content leading-relaxed space-y-4">
      <slot />
    </div>

    {data.gallery.length > 0 && (
      <section class="mt-10">
        <h2 class="text-xl font-semibold text-primary">More from this ride</h2>
        <div class="mt-4">
          <Gallery images={data.gallery} alt={data.title} />
        </div>
      </section>
    )}

    <div class="mt-10 pt-6 border-t border-base-300">
      <a href="/rides" class="text-primary hover:text-accent">← Back to all rides</a>
    </div>
  </article>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/RidePost.astro
git commit --no-gpg-sign -m "feat: add RidePost layout"
```

---

## Task 20: Home page (`/`)

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import Layout from "../layouts/Layout.astro";
import RideHero from "../components/RideHero.astro";
import RideCard from "../components/RideCard.astro";
import RouteInfo from "../components/RouteInfo.astro";
import InstagramLink from "../components/InstagramLink.astro";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

const allRides = (await getCollection("rides")).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
);

const latestRide = allRides[0];
const recentRides = allRides.slice(1, 4);
---

<Layout title={SITE_TITLE} description={SITE_DESCRIPTION}>
  <section class="bg-primary text-primary-content">
    <div class="max-w-5xl mx-auto px-4 py-10 sm:py-14">
      <p class="text-3xl sm:text-4xl font-semibold leading-tight">
        Bubbles. Big smiles. Going slow.
      </p>
      <p class="mt-3 text-lg sm:text-xl opacity-90 max-w-2xl">
        We ride together so our kids learn the road. The Horace Mann Bike Bus is a weekly group ride to school — joyful, slow, and safe.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <a href="/about" class="btn btn-accent">What's a bike bus?</a>
        <InstagramLink variant="cta" />
      </div>
    </div>
  </section>

  {latestRide ? (
    <RideHero ride={latestRide} />
  ) : (
    <section class="max-w-5xl mx-auto px-4 py-12 text-center">
      <h2 class="text-2xl font-semibold text-primary">First ride coming soon</h2>
      <p class="mt-2 text-secondary">Check back here after our next ride — photos go up the same day.</p>
    </section>
  )}

  <section class="max-w-5xl mx-auto px-4 py-10">
    <RouteInfo heading="Where & when we ride" />
  </section>

  {recentRides.length > 0 && (
    <section class="max-w-5xl mx-auto px-4 pb-12">
      <div class="flex items-end justify-between">
        <h2 class="text-2xl font-semibold text-primary">Recent rides</h2>
        <a href="/rides" class="text-primary hover:text-accent">All rides →</a>
      </div>
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recentRides.map((r) => <RideCard ride={r} />)}
      </div>
    </section>
  )}
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit --no-gpg-sign -m "feat: add home page"
```

---

## Task 21: Rides archive (`/rides`)

**Files:**
- Create: `src/pages/rides/index.astro`

- [ ] **Step 1: Create `src/pages/rides/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import Layout from "../../layouts/Layout.astro";
import RideCard from "../../components/RideCard.astro";
import { SITE_TITLE } from "../../consts";

const allRides = (await getCollection("rides")).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
);
---

<Layout
  title={`All rides — ${SITE_TITLE}`}
  description="Every ride of the Horace Mann Bike Bus, newest first."
>
  <section class="max-w-5xl mx-auto px-4 py-10">
    <h1 class="text-3xl sm:text-4xl font-semibold text-primary">All rides</h1>
    <p class="mt-2 text-secondary">Every ride, newest first.</p>

    {allRides.length === 0 ? (
      <p class="mt-10 text-secondary">No rides posted yet. Check back soon.</p>
    ) : (
      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {allRides.map((r) => <RideCard ride={r} />)}
      </div>
    )}
  </section>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/rides/index.astro
git commit --no-gpg-sign -m "feat: add rides archive page"
```

---

## Task 22: Ride detail page (`/rides/[...slug]`)

**Files:**
- Create: `src/pages/rides/[...slug].astro`

- [ ] **Step 1: Create `src/pages/rides/[...slug].astro`**

```astro
---
import { getCollection, render } from "astro:content";
import type { GetStaticPaths } from "astro";
import RidePost from "../../layouts/RidePost.astro";

export const getStaticPaths: GetStaticPaths = async () => {
  const rides = await getCollection("rides");
  return rides.map((ride) => ({
    params: { slug: ride.id.replace(/\.mdx?$/, "") },
    props: { ride },
  }));
};

const { ride } = Astro.props;
const { Content } = await render(ride);
---

<RidePost ride={ride}>
  <Content />
</RidePost>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/rides/[...slug].astro
git commit --no-gpg-sign -m "feat: add individual ride detail page"
```

---

## Task 23: About page (`/about`)

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
import RouteInfo from "../components/RouteInfo.astro";
import InstagramLink from "../components/InstagramLink.astro";
import { SITE_TITLE } from "../consts";

const faq = [
  {
    q: "What if my kid can't ride very well yet?",
    a: "That's exactly who this is for. Come ride with us. We go slow. Parents ride alongside their kids. Cargo bikes and trail-a-bikes are welcome.",
  },
  {
    q: "What if it rains?",
    a: "We post on Instagram the morning of if we're cancelling.",
  },
  {
    q: "Do we need to RSVP?",
    a: "No. Just show up at any point on the route.",
  },
  {
    q: "What kind of bike does my kid need?",
    a: "Anything that rolls and has working brakes. Scooters are welcome too.",
  },
  {
    q: "Is there a cost?",
    a: "No. It's free. It's neighbors.",
  },
  {
    q: "Can I join if my kid doesn't go to Horace Mann?",
    a: "Yes.",
  },
  {
    q: "How can I help?",
    a: "DM us on Instagram. The more parents on a ride, the safer it is.",
  },
];
---

<Layout
  title={`About — ${SITE_TITLE}`}
  description="What a bike bus is, why we do it, how we keep it safe, the route, meeting time, and FAQ."
>
  <article class="max-w-3xl mx-auto px-4 py-10 space-y-12">

    <section>
      <h1 class="text-3xl sm:text-4xl font-semibold text-primary">About the Horace Mann Bike Bus</h1>
      <p class="mt-3 text-lg text-base-content">
        We ride to school together. It's joyful, it's slow, and it's safe. Bubbles, helmets, big smiles, and lots of parents along for the ride.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-semibold text-primary">What is a bike bus?</h2>
      <div class="mt-3 space-y-3 text-base-content">
        <p>
          A bike bus is a group of kids and parents who bike to school together on a set route at a set time. Anyone along the route can join — we pick up riders at intersections like a bus.
        </p>
        <p>
          We go slow, we stay in a group, we follow traffic rules, and we make it fun. There are bubbles. Sometimes there's music. There are always helmets and high-vis.
        </p>
        <p>
          The whole point is joy plus safety, together — turning the school commute into the best part of a kid's day.
        </p>
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-semibold text-primary">Why we do it</h2>
      <ul class="mt-3 space-y-3 text-base-content list-disc pl-6">
        <li>To give kids a confident, repeated experience of riding on real streets with adults around.</li>
        <li>To turn school drop-off into something kids look forward to instead of something they're driven through.</li>
        <li>To show that our streets can belong to families, not just cars.</li>
        <li>To build a small piece of community — neighbors who know each other by name.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-2xl font-semibold text-primary">How we keep it safe</h2>
      <ul class="mt-3 space-y-3 text-base-content list-disc pl-6">
        <li><strong>Our size is our safety.</strong> A big, visible group of riders is the single biggest reason cars slow down and give us room.</li>
        <li><strong>A lot of parents.</strong> Many adults ride alongside the kids every week.</li>
        <li><strong>Sometimes a police escort.</strong> Often, but not always — when we have one, it helps at bigger intersections.</li>
        <li><strong>We stop for traffic.</strong> At major intersections and whenever cars are coming, we stop and wait.</li>
        <li><strong>Helmets required for kids.</strong> Encouraged for adults.</li>
        <li><strong>Little kids ride with a parent</strong> — alongside, on a trail-a-bike, or in a cargo bike.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-2xl font-semibold text-primary">What the kids are practicing</h2>
      <p class="mt-3 text-base-content">
        This is a learning ride. The biggest thing the kids practice each week is the most important skill for riding on the street: <em>staying on the right side of the road, going with traffic instead of against it.</em> It takes repetition to make that automatic — which is the whole point of doing it weekly with a group.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-semibold text-primary">The route</h2>
      <p class="mt-3 text-base-content">
        We start at our meeting point and roll toward Horace Mann together, picking up riders along the way. The full route is on the map below.
      </p>
      <div class="mt-4">
        <RouteInfo heading="Meeting day, time, and place" />
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-semibold text-primary">FAQ</h2>
      <div class="mt-4 space-y-4">
        {faq.map(({ q, a }) => (
          <div class="rounded-box border border-base-300 bg-base-100 p-5">
            <p class="font-medium text-primary">{q}</p>
            <p class="mt-2 text-base-content">{a}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-semibold text-primary">Contact</h2>
      <p class="mt-3 text-base-content">
        The best way to reach us is on Instagram. DM us or tag us — we read everything.
      </p>
      <div class="mt-4">
        <InstagramLink variant="cta" />
      </div>
    </section>

  </article>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/about.astro
git commit --no-gpg-sign -m "feat: add About page with bike-bus explainer, safety, FAQ"
```

---

## Task 24: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create `src/pages/404.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
import { SITE_TITLE } from "../consts";
---

<Layout
  title={`Page not found — ${SITE_TITLE}`}
  description="That page doesn't exist."
>
  <section class="max-w-3xl mx-auto px-4 py-20 text-center">
    <p class="text-6xl">🚲</p>
    <h1 class="mt-4 text-3xl font-semibold text-primary">Wrong turn!</h1>
    <p class="mt-3 text-base-content">We couldn't find that page.</p>
    <div class="mt-6 flex justify-center gap-3">
      <a href="/" class="btn btn-primary">Back home</a>
      <a href="/rides" class="btn btn-outline">See all rides</a>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/404.astro
git commit --no-gpg-sign -m "feat: add 404 page"
```

---

## Task 25: Full build verification

This task confirms the whole site builds end-to-end and produces the expected content.

**Files:** none

- [ ] **Step 1: Run a full build**

```bash
npm run build
```
Expected: completes without errors. Output ends with something like `Complete!` and writes files into `dist/`.

If you see schema errors, re-check ride frontmatter (Task 7).
If you see image errors, re-run `npm run seed:images` (Task 6).
If you see "Cannot find module '@astrojs/cloudflare'" or similar, re-run `npm install`.

- [ ] **Step 2: Confirm the four core pages built**

```bash
ls dist/index.html dist/about/index.html dist/rides/index.html dist/404.html
```
Expected: all four paths exist, no `No such file` errors.

- [ ] **Step 3: Confirm ride detail pages built**

```bash
ls dist/rides/2026-05-08-first-ride/index.html dist/rides/2026-05-22-foggy-friday/index.html
```
Expected: both files exist.

- [ ] **Step 4: Confirm key content rendered on the home page**

```bash
grep -c "Bubbles. Big smiles. Going slow." dist/index.html
grep -c "Foggy Friday" dist/index.html
grep -c "horace_mann_bike_bus" dist/index.html
```
Expected: each command prints `1` or higher (each string appears at least once).

- [ ] **Step 5: Confirm key content rendered on the about page**

```bash
grep -c "What is a bike bus?" dist/about/index.html
grep -c "Our size is our safety" dist/about/index.html
grep -c "staying on the right side of the road" dist/about/index.html
```
Expected: each command prints `1` or higher.

- [ ] **Step 6: Confirm the sitemap was generated**

```bash
ls dist/sitemap-index.xml dist/sitemap-0.xml
```
Expected: both files exist.

- [ ] **Step 7: Smoke-test the dev server**

Start the dev server in the background:
```bash
npm run dev &
DEV_PID=$!
sleep 4
curl -s http://localhost:4321/ | grep -c "Bubbles. Big smiles. Going slow."
curl -s http://localhost:4321/about | grep -c "What is a bike bus"
curl -s http://localhost:4321/rides | grep -c "All rides"
kill $DEV_PID
```
Expected: each `grep -c` prints `1` or higher. (If port 4321 is in use, Astro picks the next free port — adjust accordingly.)

Note: This step uses `sleep` to wait for the dev server to be ready before curling. If `sleep` is blocked in your environment, use the `Monitor` tool to wait for the dev server's "ready" output instead.

- [ ] **Step 8: Commit (no code change — record verification)**

There's no diff to commit from this task. Continue to Task 26.

---

## Task 26: Final cleanup commit

**Files:** none (tagging the verified state)

- [ ] **Step 1: Confirm the working tree is clean**

```bash
git status
```
Expected: `nothing to commit, working tree clean`.

If anything is dirty, inspect and commit it with an appropriate message before continuing.

- [ ] **Step 2: List recent commits**

```bash
git log --oneline | head -30
```
Expected: a series of small focused commits, ending with the verification step.

The project is now ready. To deploy:
1. Push to a git remote.
2. Connect the repo to Cloudflare Pages.
3. Set build command to `npm run build` and output directory to `dist`.
4. Update `site:` in `astro.config.mjs` to the real domain.
5. Replace `ROUTE_MAP_EMBED_SRC` in `src/consts.ts` with a real Google Maps embed for the route.
6. Update `MEETING_DAY`, `MEETING_TIME`, `MEETING_PLACE` in `src/consts.ts` with the real values.
7. Replace seed posts (`src/content/rides/2026-05-08-first-ride.mdx`, `src/content/rides/2026-05-22-foggy-friday.mdx`) and their placeholder photos in `src/content/rides/images/` with real ride content.
