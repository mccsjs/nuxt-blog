import { queryCollection } from '@nuxt/content/nitro'
import { defineEventHandler, setHeader } from 'h3'
import { siteConfig } from '#shared/site'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const posts = await queryCollection(event, 'posts').order('date', 'DESC').all()

  const items = (posts || [])
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}${post.path}</link>
      <guid>${siteUrl}${post.path}</guid>
      <description>${escapeXml(post.description || '')}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`,
    )
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>zh-CN</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  return rss
})
