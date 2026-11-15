# Nuxt 4 静态博客模板

基于 **Nuxt 4.6.4** + **Nuxt Content v3**，由 pnpm 管理。目录结构与静态生成方案遵循 [Nuxt 4 官方文档](https://nuxt.com/docs/4.x/directory-structure)。

## 环境

- Node.js：`^22.22.3 || ^24.15.0 || >=26.0.0`（`nuxt@4.6.4` 的 engines 声明；官网安装页要求 22.x 及以上）
- pnpm：10+（本模板由 pnpm 12.18.0 初始化）

`nuxt.config.ts` 中已设置 `content.experimental.sqliteConnector: 'native'`，使用 Node 内置 `node:sqlite`，因此不需要 `better-sqlite3`，也不会遇到 pnpm 10+ 拦截原生依赖构建脚本的问题。

## 命令

```bash
pnpm install      # 安装依赖（postinstall 会执行 nuxt prepare 生成 .nuxt 类型）
pnpm dev          # 开发服务器 http://localhost:3000
pnpm generate     # 静态生成，产物在 .output/public/
pnpm preview      # 本地预览构建结果
pnpm build        # SSR 构建（需要服务端部署时使用，静态站请用 generate）
```

## 目录结构

```
app/                     # Nuxt 4 默认 srcDir，~ 别名指向这里
  app.vue                # 根组件
  app.config.ts          # 站点名称、导航等运行时配置
  assets/css/main.css    # 全局样式（由构建工具处理）
  components/            # 自动导入的组件
  layouts/default.vue    # 全站布局
  pages/index.vue        # 首页：文章列表
  pages/[...slug].vue    # catch-all：把 Markdown 渲染成页面
  error.vue              # 错误页
  utils/formatDate.ts    # 自动导入的工具函数
content/                 # rootDir 下，Markdown 内容
  about.md
  blog/*.md
public/                  # 原样复制到站点根，不经过构建
  favicon.ico
  robots.txt
content.config.ts        # 内容集合与 frontmatter schema
nuxt.config.ts           # Nuxt 配置（所在目录即 rootDir）
```

## 新增文章

在 `content/blog/` 下新建 `.md` 文件：

```md
---
title: 文章标题
description: 一句话摘要
date: '2026-11-15'
tags: ['Nuxt', '教程']
---

# 文章标题

正文……
```

`title`、`description` 是 page 集合的内置字段；`date`、`tags` 属于自定义字段，已在 `content.config.ts` 的 schema 中声明，才能用于排序和查询。`date` 请写成带引号的字符串，避免 YAML 把日期解析成 Date 对象。

首页会按 `date` 倒序列出全部文章；`nuxt generate` 通过爬虫沿首页链接自动预渲染每一篇文章。**没有链接指向的孤立页面**需要加入 `nuxt.config.ts` 的 `prerender.routes`。

## 部署

把 `.output/public/` 整个目录上传到任意静态托管即可。产物含 `index.html`、`200.html`、`404.html` 与各页面的 `_payload.json`；预渲染输出不含服务端，因此不要在本模板里添加 `server/api/`。

参考：

- [Introduction](https://nuxt.com/docs/4.x/getting-started/introduction)
- [Directory Structure](https://nuxt.com/docs/4.x/directory-structure)
- [Prerendering](https://nuxt.com/docs/4.x/getting-started/prerendering)
- [Static Hosting](https://nuxt.com/docs/4.x/getting-started/deployment#static-hosting)
- [Nuxt Content v3](https://content.nuxt.com/docs/getting-started)
