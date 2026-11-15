---
title: 用 Nuxt 4 搭建静态博客的完整指南
description: 从零开始，用 Nuxt 4 + Nuxt Content + Tailwind CSS 4 搭建一个支持暗色模式与全文搜索的静态博客。
date: 2026-11-08
tags: [Nuxt, Vue, 教程]
category: 前端开发
---

搭建个人博客一直是学习新框架的最佳练手项目。这篇文章记录我用 **Nuxt 4** 搭建静态博客的完整过程，希望对你有帮助。

## 为什么选择 Nuxt 4

Nuxt 是基于 Vue 3 的全栈框架，静态博客场景下它有几个突出优点：

- **文件路由**：`app/pages` 下的文件自动生成路由
- **静态生成**：一条命令把整站渲染成 HTML，部署到任何静态托管平台
- **内容生态**：`@nuxt/content` 让 Markdown 写作体验非常顺滑

## 初始化项目

首先创建 `package.json` 并安装核心依赖：

```bash
npm install nuxt@4.6.3 @nuxt/content better-sqlite3
npm install -D tailwindcss @tailwindcss/vite @tailwindcss/typography
```

> 提示：Nuxt Content v3 使用 SQLite 存储内容索引，Node 22 上需要 better-sqlite3 提供原生支持。

## 配置内容集合

`content.config.ts` 中定义文章集合的 schema，保证每篇文章的字段类型安全：

```ts
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        tags: z.array(z.string()).default([]),
        category: z.string().default('随笔'),
      }),
    }),
  },
})
```

## 查询文章

在页面里用 `queryCollection` 拉取文章，支持排序、过滤：

```ts
const { data: posts } = await useAsyncData('posts', () =>
  queryCollection('posts')
    .order('date', 'DESC')
    .all(),
)
```

渲染正文只需要一行：

```vue
<ContentRenderer :value="post" />
```

## 静态生成

最后在 `package.json` 中加上生成命令：

```json
{
  "scripts": {
    "generate": "nuxt generate"
  }
}
```

执行后 `.output/public` 目录就是完整的静态站点，可以直接扔到任意静态托管上。✨

## 小结

- Nuxt 4 的 `app/` 目录结构清晰，组件化自由度高
- Nuxt Content 提供了类型安全的内容查询
- 配合 Tailwind CSS 可以快速做出精致的设计
