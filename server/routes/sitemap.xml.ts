import { queryCollection } from '@nuxt/content/nitro'
import { defineEventHandler, setHeader } from 'h3'
import { siteConfig } from '#shared/site'

export default defineEventHandler(async (event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const posts = await queryCollection(event, 'posts').select('path', 'date').all()

  const staticPages = ['/', '/posts', '/archive', '/tags', '/categories', '/about']
  const urls = [
    ...staticPages,
    ...(posts || []).map((p) => p.path),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${siteUrl}${url}</loc>
    <changefreq>weekly</changefreq>
  </url>`,
  )
  .join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return sitemap
})
