import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { siteConfig } from './shared/site'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-15',
  modules: ['@nuxt/content', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      siteUrl: 'https://example.com',
      twikooEnvId: 'https://pl.mccsjs.cn',
      buildTime: new Date().toISOString(),
    },
  },

  prerender: {
    crawlLinks: true,
    routes: ['/rss.xml', '/sitemap.xml'],
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: siteConfig.name,
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'description', content: '一个清新风格的个人博客，记录技术与生活。' },
      ],
      link: [
        { rel: 'icon', type: 'image/webp', href: '/favicon.webp' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/a.woff2?v=2', crossorigin: 'anonymous' },
      ],
      script: [
        {
          // 暗色模式无闪烁初始化
          innerHTML: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          tagPosition: 'head',
        },
      ],
    },
  },

  hooks: {
    'content:file:afterParse': (ctx) => {
      const content = ctx.content as Record<string, unknown>
      const path = content.path as string | undefined
      if (path?.startsWith('/posts/')) {
        const slug = (content.slug as string | undefined) || path.split('/').filter(Boolean).pop()
        content.path = `/posts/${slug}`
        if (!content.image && slug) {
          const cover = resolve(process.cwd(), 'public', 'covers', `${slug}.webp`)
          if (existsSync(cover)) content.image = `/covers/${slug}.webp`
        }
      }
    },
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark',
          langs: [
            'ts', 'js', 'mjs', 'vue', 'css', 'scss', 'html', 'bash', 'shell',
            'json', 'yaml', 'md', 'python', 'sql', 'diff', 'go', 'rust', 'java',
          ],
        },
      },
    },
  },
})
