import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
        image: z.string().optional(),
        tags: z.array(z.string()).default([]),
        category: z.string().default('随笔'),
        draft: z.boolean().default(false),
      }),
    }),
    pages: defineCollection({
      type: 'page',
      source: 'pages/*.md',
      schema: z.object({
        title: z.string(),
      }),
    }),
    links: defineCollection({
      type: 'data',
      source: 'links.csv',
      schema: z.object({
        name: z.string(),
        url: z.string(),
        description: z.string().nullish(),
        avatar: z.string().nullish(),
        type: z.string().nullish(),
        screenshot: z.string().nullish(),
        recommended: z.string().nullish(),
        sort: z.coerce.number().nullish(),
        speedtest: z.string().nullish(),
      }),
    }),
  },
})
