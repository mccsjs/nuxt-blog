<script setup lang="ts">
interface Crumb {
  label: string
  to?: string
  current?: boolean
  icon?: string
}

const route = useRoute()
const config = useRuntimeConfig()
const { data: crumbPost } = await useAsyncData(
  () => `crumb-post-${route.path}`,
  () => (route.path.startsWith('/posts/') ? queryCollection('posts').path(route.path).first() : null),
  { watch: [() => route.path] },
)

const items = computed<Crumb[]>(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  if (path === '/') return []

  const home: Crumb = { label: '主页', to: '/', icon: 'home' }
  const seg = path.split('/').filter(Boolean)
  const head = seg[0] || ''

  if (head === 'posts') {
    if (seg.length === 1) return [home, { label: '文章', current: true, icon: 'posts' }]
    return [home, { label: '文章', to: '/posts', icon: 'posts' }, { label: crumbPost.value?.title || '文章', current: true }]
  }
  if (head === 'archive') return [home, { label: '归档', current: true, icon: 'archive' }]
  if (head === 'categories') {
    if (seg.length === 1) return [home, { label: '分类', current: true, icon: 'folder' }]
    return [home, { label: '分类', to: '/categories', icon: 'folder' }, { label: decodeURIComponent(seg[1] || ''), current: true }]
  }
  if (head === 'tags') {
    if (seg.length === 1) return [home, { label: '标签', current: true, icon: 'tags' }]
    return [home, { label: '标签', to: '/tags', icon: 'tags' }, { label: `#${decodeURIComponent(seg[1] || '')}`, current: true }]
  }
  if (head === 'link') return [home, { label: '友链', current: true, icon: 'link' }]
  if (head === 'about') return [home, { label: '关于', current: true, icon: 'user' }]
  if (head === 'contact') return [home, { label: '联系', current: true, icon: 'email' }]
  if (head === 'privacy') return [home, { label: '隐私声明', current: true, icon: 'archive' }]
  return [home, { label: '页面', current: true }]
})

useHead(() => ({
  script: items.value.length
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.value.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.label,
            ...(item.to ? { item: `${config.public.siteUrl}${item.to}` } : {}),
          })),
        }),
      }]
    : [],
}))
</script>

<template>
  <nav v-if="items.length" aria-label="面包屑导航" class="mb-6">
    <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      <li v-for="(item, idx) in items" :key="idx" class="flex items-center gap-2">
        <span v-if="idx > 0" class="text-slate-300 dark:text-slate-600">/</span>
        <NuxtLink
          v-if="item.to && !item.current"
          :to="item.to"
          class="inline-flex items-center gap-1.5 text-teal-600 transition hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
        >
          <Icon v-if="item.icon" :name="item.icon" class="h-3.5 w-3.5" />
          <span>{{ item.label }}</span>
        </NuxtLink>
        <span v-else class="inline-flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-100">
          <Icon v-if="item.icon" :name="item.icon" class="h-3.5 w-3.5" />
          <span>{{ item.label }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>
