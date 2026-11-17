interface PageSeoOptions {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  author?: string
  tags?: string[]
  imageWidth?: number
  imageHeight?: number
}

export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions> = {}) {
  const route = useRoute()
  const site = useSiteConfig()
  const blog = useBlogConfig()

  const opts = computed(() => toValue(options) || {})
  const title = computed(() => opts.value.title || blog.name)
  const description = computed(() => opts.value.description || blog.description)
  const base = computed(() => site.url.replace(/\/$/, ''))
  const url = computed(() => `${base.value}${route.path === '/' ? '' : route.path}`)
  const image = computed(() => {
    const img = opts.value.image || '/img/lemon.webp'
    return img.startsWith('http') ? img : `${base.value}${img}`
  })

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogUrl: () => url.value,
    ogType: () => opts.value.type || 'website',
    ogSiteName: () => blog.name,
    ogLocale: 'zh_CN',
    ogImage: () => image.value,
    ogImageWidth: () => opts.value.imageWidth || 84,
    ogImageHeight: () => opts.value.imageHeight || 84,
    ogImageAlt: () => title.value,
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: () => image.value,
    articlePublishedTime: () => opts.value.publishedTime,
    articleAuthor: () => opts.value.author,
    articleTag: () => opts.value.tags,
  })

  useHead({
    link: [{ rel: 'canonical', href: url }],
  })

  return { url, title, description, image }
}
