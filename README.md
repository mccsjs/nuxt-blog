# 清风小筑 · Fresh Blog

基于 **Nuxt 4.6.4** + **Nuxt Content v3** + **Tailwind CSS v4** 的清新风格静态博客。

## 特性

- 清新薄荷青主题，柔和渐变背景与浮动光斑
- 暗色模式（无闪烁切换，跟随系统偏好）
- Markdown 写作（类型安全的 frontmatter schema）
- 全文搜索面板（`Ctrl/Cmd + K`）
- 分类、标签、按年份归档
- 文章目录 TOC（滚动高亮）
- 上一篇 / 下一篇
- RSS 与 Sitemap 自动生成
- 一条命令生成纯静态站点

## 快速开始

```bash
pnpm install
pnpm dev
pnpm generate
pnpm preview
```

要求 Node.js 22.x+。`better-sqlite3` 是 Nuxt Content 的原生依赖，安装失败时请确认环境具备 C++ 构建工具。

## 目录结构

```
app/
├── app.vue
├── error.vue
├── assets/css/main.css
├── components/
├── composables/
├── pages/
└── utils/
shared/site.ts
content/
├── posts/*.md
└── pages/about.md
public/
server/routes/
test/
├── unit/
├── nuxt/
└── e2e/
content.config.ts
nuxt.config.ts
```

## 写文章

在 `content/posts/` 下新建 `.md` 文件：

```yaml
---
title: 文章标题
description: 摘要
date: 2026-11-08
tags: [Nuxt, Vue]
category: 前端开发
---
```

正文支持 GFM 语法，代码块由 Shiki 高亮。

## 个性化

1. 站点信息：`shared/site.ts`
2. 主色：`app/assets/css/main.css` 的 `--color-primary-*`
3. 头像：`public/avatar.svg`
4. 域名：`NUXT_PUBLIC_SITE_URL`（影响 RSS / sitemap）

## 测试

```bash
pnpm test
```
