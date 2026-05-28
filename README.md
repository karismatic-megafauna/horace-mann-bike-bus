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
