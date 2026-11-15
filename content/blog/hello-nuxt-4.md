---
title: 从零开始一个 Nuxt 4 静态博客
description: 记录这套模板如何按官方文档落地，以及从安装到静态产物的完整链路。
date: '2026-11-15'
tags: ['Nuxt', '起步']
---

# 从零开始一个 Nuxt 4 静态博客

官网安装页给出的唯一推荐命令是 `npm create nuxt@latest <project-name>`（pnpm 对应 `pnpm create nuxt@latest`）。在非交互终端里必须补上 `--template`，官方提供了 `content` 模板，正是内容驱动站点的起点。

## 初始化

```bash
pnpm create nuxt@latest . \
  --template=content \
  --packageManager=pnpm \
  --no-install \
  --gitInit \
  --force

pnpm install
pnpm dev
```

`content` 模板生成的结构已经符合 Nuxt 4 的新约定：`app/` 放 `app.vue` 与 `pages/`，而 `content/`、`public/`、`nuxt.config.ts` 留在根目录。

## 静态生成

```bash
pnpm generate
```

`nuxt generate` 等价于 `nuxt build --prerender`：启动一个临时 Nuxt 实例，先渲染 `/`，再顺着 HTML 里的 `<a href>` 逐层爬取，把每个路由写成独立的静态 HTML，同时输出 `200.html` 与 `404.html` 供静态托管兜底。产物在 `.output/public/`。

因此只要文章在首页有链接，就会被自动预渲染；没有链接的孤立页面则需要写进 `prerender.routes`。

## 为什么用 Node 内置 SQLite

Nuxt Content v3 用 SQLite 存储解析后的内容。默认会尝试 `better-sqlite3` 这类需要编译的原生模块，而 pnpm 10+ 默认不执行依赖的构建脚本，容易踩到 `Could not locate the bindings file`。配置里显式指定官方提供的连接器即可绕开：

```ts
export default defineNuxtConfig({
  content: {
    experimental: { sqliteConnector: 'native' },
  },
})
```

Node.js 22.5+ 的 `node:sqlite` 即可满足要求，无需任何原生依赖。

[返回首页](/)
