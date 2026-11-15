---
title: 关于
description: 这个静态博客模板的技术构成、目录约定与写作方式
---

# 关于

这是一个基于 **Nuxt 4.6.4** 与 **Nuxt Content v3** 的静态博客模板，严格按官方文档的目录结构与静态生成方案组织，使用 pnpm 管理依赖。

## 技术构成

- **Nuxt 4.6.4**：默认 `srcDir` 为 `app/`，`~` 别名指向该目录；Nitro 负责构建与预渲染。
- **Nuxt Content v3**：`content/` 下的 Markdown 即站点内容，`content.config.ts` 定义集合与 schema。
- **pnpm**：`pnpm generate` 产出可直接放到任意静态托管的 `.output/public/`。

## 目录约定

| 位置 | 作用 |
| --- | --- |
| `app/` | 页面、布局、组件、样式、工具函数（Nuxt 4 的 srcDir） |
| `content/` | Markdown 文章与页面（rootDir 下，不在 app/ 内） |
| `public/` | 原样复制到站点根目录的静态资源 |
| `content.config.ts` | 内容集合定义 |
| `nuxt.config.ts` | Nuxt 配置，同时标志项目根目录 |

::alert{color="green"}
新增文章只需在 `content/blog/` 下写一个带 frontmatter 的 Markdown 文件：首页自动列出，`nuxt generate` 自动预渲染。
::

[返回首页](/)
