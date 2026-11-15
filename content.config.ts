// https://content.nuxt.com/docs/collections/define
// content/ 位于项目根目录（不是 app/），Nuxt 4 中 Content v2.13+ 会按 rootDir 解析
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    // type: 'page' 表示「一个文件 = 一个页面」，content/blog/foo.md 自动得到 /blog/foo 路径
    content: defineCollection({
      type: 'page',
      source: '**',
      // page 类型自带 path / title / description / seo / body / navigation，
      // 自定义 frontmatter 字段必须在此声明，才能被 where() / order() / select() 查询
      schema: z.object({
        date: z.string().optional(),
        tags: z.array(z.string()).default([]),
      }),
    }),
  },
})
