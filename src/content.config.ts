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
