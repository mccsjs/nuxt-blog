export type SocialIcon = 'github' | 'email' | 'bilibili' | 'x' | 'rss' | 'wechat' | 'zhihu'

export interface SocialLink {
  name: string
  url: string
  icon: SocialIcon
}

export const siteConfig = {
  name: 'mccsjs',
  author: 'mccsjs',
  siteStartDate: '2023-01-22',
  avatar: '/avatar.webp',
  slogan: '写代码，也写生活 🌿',
  description: '记录前端技术、阅读笔记与生活片段，愿文字如清风拂面。',
  email: 'hello@example.com',
  footerNote: ' Powered by Nuxt · 手植于 2026',
  interests: ['前端开发', '阅读', '徒步', '摄影', '咖啡'],
  socials: [
    { name: 'GitHub', url: 'https://github.com', icon: 'github' },
    { name: 'Email', url: 'mailto:hello@example.com', icon: 'email' },
    { name: 'Bilibili', url: 'https://www.bilibili.com', icon: 'bilibili' },
    { name: 'X', url: 'https://x.com', icon: 'x' },
  ] as SocialLink[],
}

export type SiteConfig = typeof siteConfig
