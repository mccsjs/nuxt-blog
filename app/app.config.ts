// https://nuxt.com/docs/4.x/directory-structure/app/app-config
// 运行时站点配置，组件/页面里通过 useAppConfig() 读取
export default defineAppConfig({
  site: {
    name: 'Nuxt 4 静态博客',
    description: '基于 Nuxt 4.6.4 与 Nuxt Content v3 的静态博客模板',
    author: 'Your Name',
  },
  nav: [
    { label: '首页', to: '/' },
    { label: '关于', to: '/about' },
  ],
})
