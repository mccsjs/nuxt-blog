---
title: 读懂 Nuxt 4 的目录结构
description: rootDir、srcDir 与 app/ 的职责边界，以及哪些目录必须留在项目根目录。
date: '2026-11-12'
tags: ['Nuxt', '目录结构']
---

# 读懂 Nuxt 4 的目录结构

官网对根目录的定义很直接：**包含 `nuxt.config.ts` 的目录就是 rootDir**。Nuxt 4 相对 Nuxt 3 最大的结构变化，是默认 `srcDir` 从项目根变成了 `app/`。

## 应用代码放进 app/

`app/` 下的内容由 Nuxt 按约定自动处理：

| 目录 / 文件 | 用途 |
| --- | --- |
| `pages/` | 文件式路由 |
| `layouts/` | 包裹页面的布局 |
| `components/` | 自动导入的 Vue 组件 |
| `composables/` | 自动导入的组合式函数 |
| `utils/` | 自动导入的工具函数 |
| `assets/` | 由构建工具处理的资源 |
| `app.vue` | 根组件 |
| `app.config.ts` | 运行时可读的应用配置 |
| `error.vue` | 错误页 |

一个容易忽略的连带变化：**`~` 别名现在指向 `app/`**。所以全局样式写 `css: ['~/assets/css/main.css']`，实际解析到 `app/assets/css/main.css`。

## 必须留在根目录的部分

以下目录相对 `rootDir` 解析，而不是 `srcDir`：

- `content/` —— 由 Nuxt Content 启用，Markdown 文件所在处
- `public/` —— 原样复制到站点根，不经过构建，适合 `favicon.ico`、`robots.txt`
- `server/`、`shared/`、`layers/`、`modules/`
- `nuxt.config.ts`、`content.config.ts`

把 `server/` 从应用目录里分离出来，官网给出的理由有两条：避免文件系统监听器扫描 `.git/` 与 `node_modules/` 拖慢启动，以及让服务端代码与 Vue 应用拥有各自独立、准确的 IDE 类型环境。

## 兼容旧结构

Nuxt 会检测旧结构并自动回退，迁移不是强制的。如果确实要保留 Nuxt 3 布局，可以显式配置：

```ts
export default defineNuxtConfig({
  srcDir: '.',
  dir: { app: 'app' },
})
```

但新项目没必要这么做——顺着默认约定走，第三方配置要改的地方最少。

[返回首页](/)
