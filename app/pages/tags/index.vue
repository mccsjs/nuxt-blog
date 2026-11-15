<script setup lang="ts">
const siteConfig = useSiteConfig()

const { data: posts } = await useAsyncData('tags-posts', () =>
  queryCollection('posts').select('path', 'title', 'date', 'tags').all(),
)

const tagCount = computed(() => {
  const map = new Map<string, number>()
  for (const post of posts.value || []) {
    for (const t of post.tags || []) map.set(t, (map.get(t) || 0) + 1)
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1])
})

const maxCount = computed(() => Math.max(...tagCount.value.map(([, c]) => c), 1))

function sizeFor(count: number) {
  const ratio = count / maxCount.value
  if (ratio > 0.75) return 'text-2xl'
  if (ratio > 0.5) return 'text-xl'
  if (ratio > 0.25) return 'text-base'
  return 'text-sm'
}

useSeoMeta({ title: `标签 - ${siteConfig.name}`, description: '按标签浏览博客文章' })
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <section class="fade-up mb-10 text-center">
      <h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100">标签</h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">共 {{ tagCount.length }} 个标签</p>
    </section>
    <div class="fade-up flex flex-wrap items-baseline justify-center gap-x-6 gap-y-4 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-soft backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80">
      <NuxtLink
        v-for="[name, count] in tagCount"
        :key="name"
        :to="`/tags/${encodeURIComponent(name)}`"
        class="group inline-flex items-baseline gap-1 font-semibold text-slate-500 transition hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-300"
        :class="sizeFor(count)"
      >
        <span class="text-teal-400 group-hover:text-teal-500">#</span>
        {{ name }}
        <sup class="text-xs font-normal text-slate-400 group-hover:text-teal-500">{{ count }}</sup>
      </NuxtLink>
    </div>
  </div>
</template>
