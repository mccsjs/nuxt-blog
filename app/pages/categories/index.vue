<script setup lang="ts">
const siteConfig = useSiteConfig()

const { data: posts } = await useAsyncData('categories-posts', () =>
  queryCollection('posts').select('path', 'title', 'category', 'description', 'date').all(),
)

const categoryCount = computed(() => {
  const map = new Map<string, number>()
  for (const post of posts.value || []) {
    const c = post.category || '随笔'
    map.set(c, (map.get(c) || 0) + 1)
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1])
})

useSeoMeta({ title: `分类 - ${siteConfig.name}`, description: '按分类浏览博客文章' })
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <section class="fade-up mb-10 text-center">
      <h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100">分类</h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">共 {{ categoryCount.length }} 个分类</p>
    </section>
    <div class="grid gap-4 sm:grid-cols-2">
      <NuxtLink
        v-for="[name, count] in categoryCount"
        :key="name"
        :to="`/categories/${encodeURIComponent(name)}`"
        class="fade-up group flex items-center gap-4 rounded-3xl border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-soft-lg dark:border-slate-700/70 dark:bg-slate-900/80"
      >
        <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400/90 to-sky-400/90 text-white shadow-sm transition group-hover:scale-110">
          <Icon name="folder" class="h-5 w-5" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate font-bold text-slate-700 group-hover:text-teal-600 dark:text-slate-200 dark:group-hover:text-teal-300">{{ name }}</span>
          <span class="text-xs text-slate-400">{{ count }} 篇文章</span>
        </span>
        <Icon name="arrowRight" class="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-400" />
      </NuxtLink>
    </div>
  </div>
</template>
