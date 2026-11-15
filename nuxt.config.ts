import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-15',
  modules: ['@nuxt/content'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      siteUrl: 'https://example.com',
    },
  },

  prerender: {
    crawlLinks: true,
    routes: ['/rss.xml', '/sitemap.xml'],
  },

  app: {
    head: {
      title: '清风小筑',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'description', content: '一个清新风格的个人博客，记录技术与生活。' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [
        {
          // 暗色模式无闪烁初始化
          innerHTML: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          tagPosition: 'head',
        },
      ],
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
