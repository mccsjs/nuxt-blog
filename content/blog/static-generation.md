---
title: 静态站：nuxt generate 到底做了什么
description: 预渲染、爬虫发现路由、payload 提取与静态托管兜底文件的关系。
date: '2026-11-08'
tags: ['Nuxt', '部署']
---

# 静态站：nuxt generate 到底做了什么

Nuxt 默认开启 SSR，但官网明确说明：可以用 `nuxt generate` 把整个应用静态渲染后部署到任意静态托管。

## 不是关掉 SSR

静态站的正确姿势是 **保持 `ssr: true`**。`nuxt generate` 会在构建期把每个路由渲染成完整 HTML；如果设 `ssr: false`，产出的 HTML 只有空的 `<div id="__nuxt"></div>`，SEO 收益会丢失。

## 爬虫如何发现页面

Nitro 的预渲染流程是：

1. 加载根路由 `/`、所有非动态页面，以及 `prerender.routes` 中的路径；
2. 把 HTML 与 `_payload.json` 写入 `.output/public/`；
3. 从 HTML 中找出所有 `<a href>` 继续递归，直到没有新链接。

这意味着**没被任何页面链接到的路由不会被预渲染**。本模板首页列出全部文章、页头链接「关于」，所以三类页面都能被发现；若以后新增孤立页面，需要补配置：

```ts
export default defineNuxtConfig({
  prerender: {
    crawlLinks: true,
    routes: ['/archive'],
  },
})
```

## 产物与兜底

- `.output/public/` 是可以直接上传的静态目录；
- `index.html`、`200.html`、`404.html` 会一并生成，静态托管商按需配置；
- `_payload.json` 保存构建期抓取的数据，客户端导航时复用，站内跳转无需再次请求内容数据；
- 预渲染产物里**不会包含服务端**，因此不要再写 `server/api/`，需要后端能力时应改用 `nuxt build`。

## 本地检查

```bash
pnpm generate
pnpm exec serve .output/public
```

`serve` 只是本地预览用；实际部署时把 `.output/public/` 整个目录交给 GitHub Pages、Netlify、Cloudflare Pages 之类的静态托管即可。

[返回首页](/)
