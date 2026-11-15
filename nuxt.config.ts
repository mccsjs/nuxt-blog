// https://nuxt.com/docs/4.x/directory-structure/nuxt-config
// 含本文件的目录 = rootDir；Nuxt 4 默认 srcDir 为 app/，~ 别名指向 app/
export default defineNuxtConfig({
  modules: ['@nuxt/content'],

  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',

  // app/assets/ 由构建工具处理，通过全局 css 引入
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'zh-CN' },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  content: {
    // Node.js >= 22.5 自带 node:sqlite，无需 better-sqlite3 等需编译的原生依赖。
    // 这一点对 pnpm 10+ 尤其重要：pnpm 默认不执行第三方依赖的构建脚本。
    experimental: { sqliteConnector: 'native' },
  },

  // 静态站：nuxt generate 由 Nitro 爬虫从首页 <a> 链接出发，预渲染所有可达页面
  // https://nuxt.com/docs/4.x/getting-started/prerendering
  prerender: {
    crawlLinks: true,
  },
})
