---
title: Tailwind CSS v4 上手体验
description: CSS-first 配置、原生级联变量、更快的构建速度——聊聊 Tailwind v4 带来的变化。
date: 2026-09-20
tags: [CSS, Tailwind]
category: 前端开发
---

Tailwind CSS v4 的发布可以说是这个框架诞生以来最大的一次重构。用了一段时间之后，把体验记录下来。

## CSS-first 配置

v4 最大的变化是不再需要 `tailwind.config.js`，主题配置直接写在 CSS 里：

```css
@import "tailwindcss";

@theme {
  --color-primary-500: #14b8a6;
  --font-sans: "PingFang SC", system-ui, sans-serif;
  --shadow-soft: 0 4px 20px -4px rgb(20 184 166 / 0.12);
}
```

定义后即可直接使用 `bg-primary-500`、`shadow-soft` 这样的工具类，构建时会自动展开。

## 自定义暗色模式变体

之前要切 class 暗色模式得改配置文件，现在一行搞定：

```css
@custom-variant dark (&:where(.dark, .dark *));
```

配合 JS 在 `<html>` 上切换 `.dark` 类即可。

## 构建速度

官方宣称全量构建快 5 倍以上，实际体验中借助新的 Oxide 引擎，开发时的热更新几乎是即时的。

| 项目 | v3 | v4 |
| ---- | -- | -- |
| 配置方式 | JS 文件 | CSS @theme |
| 构建引擎 | PostCSS | Oxide（Rust） |
| 内容检测 | 手动配置 | 自动 |

## 迁移建议

- 小项目直接迁移，半天可以搞定
- 依赖第三方插件的项目留意 `@plugin` 语法的变化
- typography、forms 等官方插件都已适配 v4

总体来说 v4 让 Tailwind 回归了「CSS 是一等公民」的理念，值得升级。
